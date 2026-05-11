import Info from '@/walletManager/models/Info'
import Balance, { BalanceAddress } from '@/walletManager/models/Balance'
import Tx from '@/walletManager/models/Tx'
import AddressInfo from '@/walletManager/models/AddressInfo'
import SendMaxInfo from '@/walletManager/models/SendMaxInfo'
import { TxProposal, TxProposalResponse, UnspentOutput } from '@/walletManager/models/TxProposal'
import { ElectrumDiscoveryState, WalletConfigItem } from '@/walletManager/ManagerConfig'
import ElectrumXClient, {
  ElectrumHistoryEntry,
  ElectrumListUnspentEntry,
  ElectrumTransaction,
  ElectrumTransactionVin
} from '@/walletManager/electrumx/ElectrumXClient'
import {
  deriveElectrumAddressAt,
  createElectrumAccountPrivateKey,
  deriveElectrumPrivateKeyForPath
} from '@/walletManager/electrumx/derive'
import {
  ElectrumServerConfig,
  normalizeElectrumServer,
  parseElectrumServer,
  serializeElectrumServer
} from '@/utils/electrumServers'
import constants from '@/utils/constants'
// @ts-ignore
import Bitcore from 'bitcore-lib'
// @ts-ignore
import WalletUtils from 'bitcore-wallet-client-xvg/lib/common/utils'

const ADDRESS_GAP_LIMIT = 20
const MAX_ADDRESS_SCAN = 200
const ADDRESS_SCAN_BATCH_SIZE = 8
const FALLBACK_FEE_PER_KB = constants.feePerKb
const MIN_TX_FEE = constants.feePerKb
const MAX_FEE_PER_KB = 1000000
const DUST_AMOUNT = 546
const ATOMIC_UNITS_PER_COIN = constants.satoshiDivider

export default class ElectrumXWallet {
  protected walletConfig: WalletConfigItem
  protected client: ElectrumXClient
  protected nextExternalIndex: number
  protected nextChangeIndex: number
  protected hasScannedAddressSpace: boolean
  protected useTor: boolean
  protected transactionDetails: Map<string, ElectrumTransaction>
  protected utxoCache: UnspentOutput[]
  protected configDirty: boolean
  public identifier: string
  public name?: string
  public color?: string
  public info?: Info
  public transactions: Tx[] = []
  public addresses: AddressInfo[] = []
  public txProposals: TxProposalResponse[] = []

  constructor (walletConfig: WalletConfigItem, server: ElectrumServerConfig, useTor: boolean = true) {
    this.walletConfig = walletConfig
    this.identifier = walletConfig.identifier
    this.name = walletConfig.name
    this.color = walletConfig.color
    this.nextExternalIndex = Number(walletConfig.electrumState?.nextExternalIndex || 0)
    this.nextChangeIndex = Number(walletConfig.electrumState?.nextChangeIndex || 0)
    this.hasScannedAddressSpace = false
    this.useTor = useTor
    this.transactionDetails = new Map()
    this.utxoCache = []
    this.configDirty = false
    this.client = new ElectrumXClient(normalizeElectrumServer(server), useTor)
    this.info = {
      name: this.name || walletConfig.name,
      balance: {
        totalAmount: 0,
        lockedAmount: 0,
        totalConfirmedAmount: 0,
        lockedConfirmedAmount: 0,
        availableAmount: 0,
        availableConfirmedAmount: 0,
        byAddress: []
      },
      wallet: {
        backend: 'electrumx',
        coin: walletConfig.coin,
        network: walletConfig.network,
        singleAddress: walletConfig.singleAddress === true,
        supportsSending: true,
        electrumConnected: false,
        electrumServer: this.getElectrumServerLabel()
      }
    }
  }

  public async create (): Promise<Info> {
    return this.open()
  }

  public async open (): Promise<Info> {
    return this.refreshWalletState()
  }

  public async status (): Promise<Info> {
    return this.refreshWalletState()
  }

  public async fetchBalance (): Promise<Balance> {
    if (!this.info) {
      await this.refreshWalletState()
    }

    return this.info!.balance
  }

  public async scan (): Promise<boolean> {
    this.hasScannedAddressSpace = false
    this.transactionDetails.clear()
    this.utxoCache = []
    this.markConfigDirty()
    await this.refreshWalletState()
    return true
  }

  public async fetchTxHistory (): Promise<Tx[]> {
    const walletAddresses = await this.ensureAddressSpace()
    const addressByValue = new Map(walletAddresses.map(address => [address.address, address]))
    const walletAddressSet = new Set(walletAddresses.map(address => address.address))
    const historyMap = new Map<string, ElectrumHistoryEntry>()

    const historyResults = await Promise.all(walletAddresses.map(async address => ({
      address,
      historyEntries: await this.client.getHistory(address.address)
    })))

    for (const result of historyResults) {
      for (const entry of result.historyEntries) {
        const current = historyMap.get(entry.txHash)

        if (!current || current.height < entry.height) {
          historyMap.set(entry.txHash, entry)
        }
      }
    }

    const txs = await Promise.all(Array.from(historyMap.values()).map(entry => this.buildTransaction(entry, walletAddressSet, addressByValue)))
    this.transactions = txs
      .filter((transaction): transaction is Tx => transaction !== null)
      .sort((left, right) => right.time - left.time)

    return this.transactions
  }

  public getTxHistory (): Tx[] {
    return this.transactions
  }

  public async getTxProposals (): Promise<TxProposalResponse[]> {
    this.txProposals = []
    return this.txProposals
  }

  public async createTxProposal (proposal: TxProposal): Promise<TxProposalResponse> {
    const outputs = proposal.outputs || []

    if (outputs.length !== 1) {
      throw new Error('Only single-recipient sends are currently supported.')
    }

    const output = outputs[0]
    const amount = Number(output.amount || 0)

    if (!Bitcore.Address.isValid(output.toAddress, 'livenet')) {
      throw new Error('INVALID_ADDRESS: Invalid address')
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('The transaction amount must be greater than zero.')
    }

    const utxos = await this.fetchSpendableUtxos(proposal.excludeUnconfirmedUtxos !== true)
    const feePerKb = await this.resolveFeePerKb(proposal.feePerKb)
    const selected = this.selectInputsForAmount(utxos, amount, feePerKb)
    const totalInputs = selected.reduce((sum, input) => sum + input.satoshis, 0)
    const changeAddress = await this.getNextChangeAddress()

    let fee = this.calculateFee(selected.length, 2, feePerKb)
    let changeAmount = totalInputs - amount - fee

    if (changeAmount <= DUST_AMOUNT) {
      fee = totalInputs - amount
      changeAmount = 0
    }

    const txp: TxProposalResponse & Record<string, any> = {
      createdOn: Math.floor(Date.now() / 1000),
      timestamp: Math.floor(Date.now() / 1000),
      coin: this.walletConfig.coin,
      id: `electrumx-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`,
      network: this.walletConfig.network,
      message: proposal.message || '',
      inputs: selected,
      fee,
      status: 'pending',
      creatorId: this.identifier,
      walletN: 1,
      walletM: 1,
      outputs: [{
        toAddress: output.toAddress,
        amount,
        message: output.message || ''
      }] as any,
      amount,
      changeAddress,
      walletId: this.identifier,
      requiredSignatures: 1,
      version: 3,
      excludeUnconfirmedUtxos: proposal.excludeUnconfirmedUtxos === true,
      addressType: 'P2PKH',
      requiredRejections: 1,
      outputOrder: changeAmount > DUST_AMOUNT ? [0, 1] : [0],
      inputPaths: selected.map(input => input.path),
      toAddress: output.toAddress
    }

    return txp
  }

  public async publishTxProposal (proposal: TxProposalResponse): Promise<TxProposalResponse> {
    return {
      ...proposal,
      status: 'pending'
    }
  }

  public async signTxProposal (proposal: TxProposalResponse, _passphrase: string): Promise<TxProposalResponse> {
    const tx = WalletUtils.buildTx(proposal as any)
    const privateKeys = proposal.inputs.map(input => {
      const derived = deriveElectrumPrivateKeyForPath(
        this.walletConfig.paperkey,
        this.walletConfig.mnemonicPassphrase || '',
        input.path
      )

      return derived.privateKey
    })

    tx.sign(privateKeys)

    return {
      ...proposal,
      rawTxUnsigned: tx.uncheckedSerialize(),
      rawTx: tx.serialize({
        disableSmallFees: true,
        disableLargeFees: true,
        disableDustOutputs: true
      }),
      txid: tx.id,
      status: 'accepted'
    } as TxProposalResponse
  }

  public async broadcastTxProposal (proposal: TxProposalResponse): Promise<TxProposalResponse> {
    const rawTx = (proposal as Record<string, any>).rawTx

    if (!rawTx) {
      throw new Error('Signed transaction payload missing.')
    }

    const txid = await this.client.broadcastTransaction(String(rawTx))

    this.transactionDetails.delete(txid)
    this.utxoCache = []
    this.hasScannedAddressSpace = false

    return {
      ...proposal,
      txid,
      status: 'broadcasted'
    } as TxProposalResponse
  }

  public async removeTxProposal (_proposal: TxProposalResponse): Promise<TxProposalResponse[]> {
    return []
  }

  public async createAddress (): Promise<AddressInfo> {
    if (this.walletConfig.singleAddress) {
      const staticAddress = this.buildAddressInfo(0, 0)

      if (!this.addresses.find(address => address.address === staticAddress.address)) {
        this.addresses.unshift(staticAddress)
      }

      return staticAddress
    }

    const addressInfo = this.buildAddressInfo(0, this.nextExternalIndex)
    this.nextExternalIndex++
    this.updateElectrumState({
      discoveredExternalCount: this.nextExternalIndex,
      nextExternalIndex: this.nextExternalIndex
    })
    this.addresses.unshift(addressInfo)
    return addressInfo
  }

  public async getMainAddresses (_options: object): Promise<AddressInfo[]> {
    if (this.addresses.length === 0) {
      await this.refreshWalletState()
    }

    return this.addresses.filter(address => !address.isChange)
  }

  public async getAddress (): Promise<AddressInfo> {
    if (this.walletConfig.singleAddress) {
      const staticAddress = this.buildAddressInfo(0, 0)

      if (!this.addresses.find(address => address.address === staticAddress.address)) {
        this.addresses.unshift(staticAddress)
      }

      return staticAddress
    }

    const mainAddresses = await this.getMainAddresses({})
    const nextUnused = mainAddresses.find(address => address.path === `m/0/${this.nextExternalIndex}`)
    if (nextUnused) {
      return nextUnused
    }

    return this.createAddress()
  }

  public async getSendMaxInfo (_returnInputs: boolean = false): Promise<SendMaxInfo> {
    const utxos = await this.fetchSpendableUtxos(true)
    const feePerKb = await this.resolveFeePerKb()
    const inputs = [...utxos].sort((left, right) => right.satoshis - left.satoshis)
    const totalAmount = inputs.reduce((sum, input) => sum + input.satoshis, 0)
    const fee = this.calculateFee(inputs.length, 1, feePerKb)
    const amount = Math.max(totalAmount - fee, 0)

    return {
      size: this.estimateTxSize(inputs.length, 1),
      amount,
      fee,
      feePerKb,
      inputs,
      utxosBelowFee: 0,
      amountBelowFee: 0,
      utxosAboveMaxSize: 0,
      amountAboveMaxSize: 0
    }
  }

  public setName (name: string): void {
    this.name = name
    this.walletConfig.name = name
  }

  public setColor (color: string): void {
    this.color = color
    this.walletConfig.color = color
  }

  public setSingleAddress (singleAddress: boolean): void {
    this.walletConfig.singleAddress = singleAddress === true
    this.hasScannedAddressSpace = false

    if (this.info && this.info.wallet) {
      this.info.wallet.singleAddress = this.walletConfig.singleAddress === true
    }

    this.markConfigDirty()
  }

  public setElectrumServer (server: ElectrumServerConfig): void {
    this.client = new ElectrumXClient(server, this.useTor)
    this.hasScannedAddressSpace = false
    this.walletConfig.electrumServer = serializeElectrumServer(server)
    this.setElectrumConnectionState(false)
    this.markConfigDirty()
  }

  public getExportConfig (): object {
    return {
      name: this.name,
      color: this.color,
      backend: 'electrumx',
      coin: this.walletConfig.coin,
      network: this.walletConfig.network,
      paperkey: this.walletConfig.paperkey,
      mnemonicPassphrase: this.walletConfig.mnemonicPassphrase || '',
      singleAddress: this.walletConfig.singleAddress === true,
      electrumServer: this.walletConfig.electrumServer,
      electrumState: this.getElectrumDiscoveryState()
    }
  }

  public getWalletConfig (): WalletConfigItem {
    return {
      ...this.walletConfig,
      name: this.name || this.walletConfig.name,
      color: this.color || this.walletConfig.color,
      backend: 'electrumx',
      singleAddress: this.walletConfig.singleAddress === true,
      electrumServer: this.walletConfig.electrumServer || serializeElectrumServer(this.client.getServer()),
      electrumState: this.getElectrumDiscoveryState()
    }
  }

  public hasPendingConfigChanges (): boolean {
    return this.configDirty
  }

  public acknowledgeConfigPersisted (): void {
    this.configDirty = false
  }

  public getAccountPrivateKey () {
    return createElectrumAccountPrivateKey(this.walletConfig.paperkey, this.walletConfig.mnemonicPassphrase || '')
  }

  protected async refreshWalletState (): Promise<Info> {
    try {
      const activeAddresses = await this.ensureAddressSpace()

      const balanceByAddress = await Promise.all(activeAddresses.map(async address => {
        const balance = await this.client.getBalance(address.address)
        return {
          address,
          amount: Number(balance.confirmed || 0) + Number(balance.unconfirmed || 0),
          confirmed: Number(balance.confirmed || 0),
          unconfirmed: Number(balance.unconfirmed || 0)
        }
      }))

      const byAddress: BalanceAddress[] = balanceByAddress
        .filter(entry => entry.amount > 0)
        .map(entry => ({
          address: entry.address.address,
          path: entry.address.path,
          amount: entry.amount
        }))

      const totalAmount = balanceByAddress.reduce((sum, entry) => sum + entry.amount, 0)
      const totalConfirmedAmount = balanceByAddress.reduce((sum, entry) => sum + entry.confirmed, 0)
      const availableConfirmedAmount = totalConfirmedAmount
      const availableAmount = totalAmount

      this.addresses = activeAddresses

      this.info = {
        name: this.name || this.walletConfig.name,
        balance: {
          totalAmount,
          lockedAmount: 0,
          totalConfirmedAmount,
          lockedConfirmedAmount: 0,
          availableAmount,
          availableConfirmedAmount,
          byAddress
        },
        wallet: {
          backend: 'electrumx',
          coin: this.walletConfig.coin,
          network: this.walletConfig.network,
          singleAddress: this.walletConfig.singleAddress === true,
          supportsSending: true,
          electrumConnected: true,
          electrumServer: this.getElectrumServerLabel()
        }
      }

      return this.info
    } catch (error) {
      this.setElectrumConnectionState(false)
      throw error
    }
  }

  protected setElectrumConnectionState (connected: boolean): void {
    const currentBalance = this.info?.balance || {
      totalAmount: 0,
      lockedAmount: 0,
      totalConfirmedAmount: 0,
      lockedConfirmedAmount: 0,
      availableAmount: 0,
      availableConfirmedAmount: 0,
      byAddress: []
    }

    this.info = {
      name: this.name || this.walletConfig.name,
      balance: currentBalance,
      wallet: {
        backend: 'electrumx',
        coin: this.walletConfig.coin,
        network: this.walletConfig.network,
        singleAddress: this.walletConfig.singleAddress === true,
        supportsSending: true,
        electrumConnected: connected,
        electrumServer: this.getElectrumServerLabel()
      }
    }
  }

  protected getElectrumServerLabel (): string {
    const server = this.client.getServer()
    const protocolLabel = server.protocol === 'ssl' ? 'SSL' : 'TCP'
    return `${server.host}:${server.port} (${protocolLabel})`
  }

  protected async ensureAddressSpace (): Promise<AddressInfo[]> {
    let activeAddresses = this.addresses

    if (!this.hasScannedAddressSpace || activeAddresses.length === 0) {
      const discoveredExternal = await this.discoverAddresses(0)
      const discoveredChange = await this.discoverAddresses(1)
      const nextUnusedExternal = this.buildAddressInfo(0, this.nextExternalIndex)
      const nextUnusedChange = this.buildAddressInfo(1, this.nextChangeIndex)
      activeAddresses = [
        ...discoveredExternal,
        ...discoveredChange,
        nextUnusedExternal,
        nextUnusedChange
      ]
      this.addresses = activeAddresses
      this.hasScannedAddressSpace = true
    }

    return activeAddresses
  }

  protected async discoverAddresses (change: 0 | 1): Promise<AddressInfo[]> {
    const persistedCount = change === 0
      ? Number(this.walletConfig.electrumState?.discoveredExternalCount || 0)
      : Number(this.walletConfig.electrumState?.discoveredChangeCount || 0)
    const discovered: AddressInfo[] = Array.from({ length: persistedCount }, (_, discoveredIndex) => (
      this.buildAddressInfo(change, discoveredIndex)
    ))
    let consecutiveUnused = 0
    let index = persistedCount

    while (consecutiveUnused < ADDRESS_GAP_LIMIT && index < MAX_ADDRESS_SCAN) {
      const remaining = MAX_ADDRESS_SCAN - index
      const batchSize = Math.min(ADDRESS_SCAN_BATCH_SIZE, remaining)
      const batch = Array.from({ length: batchSize }, (_, offset) => {
        const addressIndex = index + offset
        const addressInfo = this.buildAddressInfo(change, addressIndex)

        return this.client.getHistory(addressInfo.address).then(history => ({
          addressInfo,
          history
        }))
      })

      const batchResults = await Promise.all(batch)

      for (const result of batchResults) {
        if (result.history.length > 0) {
          discovered.push(result.addressInfo)
          consecutiveUnused = 0
        } else {
          consecutiveUnused++
        }

        index++

        if (consecutiveUnused >= ADDRESS_GAP_LIMIT || index >= MAX_ADDRESS_SCAN) {
          break
        }
      }
    }

    if (change === 0) {
      this.nextExternalIndex = discovered.length
      this.updateElectrumState({
        discoveredExternalCount: discovered.length,
        nextExternalIndex: discovered.length
      })
    } else {
      this.nextChangeIndex = discovered.length
      this.updateElectrumState({
        discoveredChangeCount: discovered.length,
        nextChangeIndex: discovered.length
      })
    }

    return discovered
  }

  protected async fetchSpendableUtxos (includeUnconfirmed: boolean): Promise<UnspentOutput[]> {
    const addresses = await this.ensureAddressSpace()
    const mainAddresses = addresses.filter(address => !address.isChange)
    const changeAddresses = addresses.filter(address => address.isChange)
    const spendableAddresses = [...mainAddresses, ...changeAddresses]
    const utxoEntries = await Promise.all(spendableAddresses.map(async address => {
      const entries = await this.client.listUnspent(address.address)
      return entries.map(entry => this.mapUtxoEntry(address, entry))
    }))

    const utxos = utxoEntries
      .flat()
      .filter(utxo => includeUnconfirmed || utxo.confirmations > 0)
      .sort((left, right) => right.satoshis - left.satoshis)

    this.utxoCache = utxos

    return utxos
  }

  protected mapUtxoEntry (address: AddressInfo, entry: ElectrumListUnspentEntry): UnspentOutput {
    return {
      address: address.address,
      confirmations: entry.height > 0 ? 1 : 0,
      satoshis: Number(entry.value || 0),
      scriptPubKey: Bitcore.Script.buildPublicKeyHashOut(address.address).toHex(),
      txid: entry.txHash,
      txID: entry.txHash,
      vout: entry.vout,
      publicKeys: address.publicKeys,
      path: address.path,
      locked: false
    }
  }

  protected async resolveFeePerKb (requestedFeePerKb?: number): Promise<number> {
    if (requestedFeePerKb && requestedFeePerKb > 0) {
      return requestedFeePerKb
    }

    try {
      const estimatedCoinsPerKb = await this.client.estimateFee(1)

      if (estimatedCoinsPerKb > 0) {
        const atomicFee = Math.round(estimatedCoinsPerKb * constants.satoshiDivider)
        return Math.min(Math.max(atomicFee, 1), MAX_FEE_PER_KB)
      }
    } catch (error) {
      // Fall back to the wallet default below.
    }

    return FALLBACK_FEE_PER_KB
  }

  protected selectInputsForAmount (utxos: UnspentOutput[], amount: number, feePerKb: number): UnspentOutput[] {
    const selected: UnspentOutput[] = []
    let total = 0

    for (const utxo of utxos) {
      selected.push(utxo)
      total += utxo.satoshis

      let fee = this.calculateFee(selected.length, 2, feePerKb)
      let change = total - amount - fee

      if (change <= DUST_AMOUNT) {
        fee = this.calculateFee(selected.length, 1, feePerKb)
        change = total - amount - fee
      }

      if (change >= 0) {
        return selected
      }
    }

    throw new Error('Insufficient funds.')
  }

  protected estimateTxSize (inputsCount: number, outputsCount: number): number {
    return 10 + (inputsCount * 148) + (outputsCount * 34)
  }

  protected calculateFee (inputsCount: number, outputsCount: number, feePerKb: number): number {
    const size = this.estimateTxSize(inputsCount, outputsCount)
    return Math.max(Math.ceil((size * feePerKb) / 1000), MIN_TX_FEE, 1)
  }

  protected async getNextChangeAddress (): Promise<AddressInfo> {
    await this.ensureAddressSpace()

    for (const address of this.addresses.filter(entry => entry.isChange)) {
      const history = await this.client.getHistory(address.address)

      if (history.length === 0) {
        return address
      }
    }

    const addressInfo = this.buildAddressInfo(1, this.nextChangeIndex)
    this.nextChangeIndex++
    this.updateElectrumState({ nextChangeIndex: this.nextChangeIndex })
    this.addresses.push(addressInfo)
    return addressInfo
  }

  protected async buildTransaction (
    entry: ElectrumHistoryEntry,
    walletAddressSet: Set<string>,
    addressByValue: Map<string, AddressInfo>
  ): Promise<Tx | null> {
    const transaction = await this.getTransactionDetails(entry.txHash)
    const outputBreakdown = this.getTransactionOutputBreakdown(transaction, walletAddressSet)
    const inputBreakdown = await this.getTransactionInputBreakdown(transaction, walletAddressSet)
    const confirmations = Number(transaction.confirmations || (entry.height > 0 ? 1 : 0))
    const isOutgoing = inputBreakdown.walletInputValue > 0
    const action = this.resolveTransactionAction(isOutgoing, outputBreakdown.externalValue, confirmations)
    const amount = this.resolveTransactionAmount(action, outputBreakdown, inputBreakdown)
    const time = Number(transaction.blocktime || transaction.time || Math.floor(Date.now() / 1000))

    if (amount <= 0 && action !== 'moved') {
      return null
    }

    return {
      id: transaction.txid,
      txid: transaction.txid,
      confirmations,
      blockheight: entry.height,
      fees: inputBreakdown.fee,
      time,
      size: Number(transaction.size || 0),
      action,
      amount,
      outputs: this.resolveDisplayOutputs(action, outputBreakdown, addressByValue),
      createdOn: time
    }
  }

  protected async getTransactionDetails (txid: string): Promise<ElectrumTransaction> {
    const cached = this.transactionDetails.get(txid)

    if (cached) {
      return cached
    }

    const result = await this.client.getTransaction(txid, true)

    if (typeof result === 'string') {
      throw new Error(`ElectrumX returned non-verbose transaction data for ${txid}`)
    }

    this.transactionDetails.set(txid, result)
    return result
  }

  protected getTransactionOutputBreakdown (transaction: ElectrumTransaction, walletAddressSet: Set<string>) {
    const walletOutputs: Array<{ address: string, amount: number }> = []
    const externalOutputs: Array<{ address: string, amount: number }> = []
    let walletValue = 0
    let externalValue = 0

    for (const output of transaction.vout || []) {
      const addresses = output.scriptPubKey?.addresses || []
      const address = output.scriptPubKey?.address || addresses[0] || 'false'
      const amount = this.normalizeTransactionValue(output.value)

      if (walletAddressSet.has(address)) {
        walletValue += amount
        walletOutputs.push({ address, amount })
      } else {
        externalValue += amount
        externalOutputs.push({ address, amount })
      }
    }

    return {
      walletOutputs,
      externalOutputs,
      walletValue,
      externalValue
    }
  }

  protected async getTransactionInputBreakdown (transaction: ElectrumTransaction, walletAddressSet: Set<string>) {
    const previousOutputs = await Promise.all((transaction.vin || []).map(input => this.resolvePreviousOutput(input)))
    let totalInputValue = 0
    let walletInputValue = 0

    for (const previousOutput of previousOutputs) {
      if (!previousOutput) {
        continue
      }

      totalInputValue += previousOutput.amount

      if (walletAddressSet.has(previousOutput.address)) {
        walletInputValue += previousOutput.amount
      }
    }

    const totalOutputValue = (transaction.vout || []).reduce((sum, output) => sum + Number(output.value || 0), 0)
    const fee = totalInputValue > 0 ? Math.max(totalInputValue - totalOutputValue, 0) : 0

    return {
      totalInputValue,
      walletInputValue,
      fee
    }
  }

  protected async resolvePreviousOutput (input: ElectrumTransactionVin): Promise<{ address: string, amount: number } | null> {
    if (!input.txid || input.vout === undefined || input.vout === null) {
      return null
    }

    const previousTransaction = await this.getTransactionDetails(input.txid)
    const previousOutput = (previousTransaction.vout || []).find(output => Number(output.n) === Number(input.vout))

    if (!previousOutput) {
      return null
    }

    const addresses = previousOutput.scriptPubKey?.addresses || []
    const address = previousOutput.scriptPubKey?.address || addresses[0] || 'false'

    return {
      address,
      amount: this.normalizeTransactionValue(previousOutput.value)
    }
  }

  protected resolveTransactionAction (isOutgoing: boolean, externalValue: number, confirmations: number): string {
    if (isOutgoing) {
      if (externalValue > 0) {
        return confirmations > 0 ? 'sent' : 'sending'
      }

      return 'moved'
    }

    return confirmations > 0 ? 'received' : 'receiving'
  }

  protected resolveTransactionAmount (
    action: string,
    outputBreakdown: {
      walletValue: number
      externalValue: number
    },
    inputBreakdown: {
      walletInputValue: number
      fee: number
    }
  ): number {
    switch (action) {
      case 'sent':
      case 'sending':
        return outputBreakdown.externalValue
      case 'moved':
        return Math.max(outputBreakdown.walletValue - inputBreakdown.walletInputValue + inputBreakdown.fee, 0)
      case 'received':
      case 'receiving':
      default:
        return outputBreakdown.walletValue
    }
  }

  protected resolveDisplayOutputs (
    action: string,
    outputBreakdown: {
      walletOutputs: Array<{ address: string, amount: number }>
      externalOutputs: Array<{ address: string, amount: number }>
    },
    addressByValue: Map<string, AddressInfo>
  ): any[] {
    const sourceOutputs = action === 'sent' || action === 'sending'
      ? outputBreakdown.externalOutputs
      : outputBreakdown.walletOutputs

    if (sourceOutputs.length === 0) {
      return [{
        address: 'false',
        amount: 0
      }]
    }

    return sourceOutputs.map(output => ({
      address: output.address,
      amount: output.amount,
      path: addressByValue.get(output.address)?.path
    }))
  }

  protected buildAddressInfo (change: 0 | 1, index: number): AddressInfo {
    const derived = deriveElectrumAddressAt(
      this.walletConfig.paperkey,
      this.walletConfig.mnemonicPassphrase || '',
      change,
      index
    )

    return {
      address: derived.address,
      coin: this.walletConfig.coin,
      createdOn: Math.floor(Date.now() / 1000),
      isChange: derived.isChange,
      network: this.walletConfig.network,
      path: derived.path,
      publicKeys: derived.publicKeys,
      type: 'P2PKH',
      version: '1.0.0',
      walletId: this.identifier
    }
  }

  protected getElectrumDiscoveryState (): ElectrumDiscoveryState {
    return {
      discoveredExternalCount: Number(this.walletConfig.electrumState?.discoveredExternalCount || 0),
      discoveredChangeCount: Number(this.walletConfig.electrumState?.discoveredChangeCount || 0),
      nextExternalIndex: this.nextExternalIndex,
      nextChangeIndex: this.nextChangeIndex
    }
  }

  protected updateElectrumState (patch: Partial<ElectrumDiscoveryState>): void {
    const previousState = JSON.stringify(this.getElectrumDiscoveryState())
    this.walletConfig.electrumState = {
      discoveredExternalCount: Number(this.walletConfig.electrumState?.discoveredExternalCount || 0),
      discoveredChangeCount: Number(this.walletConfig.electrumState?.discoveredChangeCount || 0),
      nextExternalIndex: this.nextExternalIndex,
      nextChangeIndex: this.nextChangeIndex,
      ...patch
    }

    if (previousState !== JSON.stringify(this.getElectrumDiscoveryState())) {
      this.markConfigDirty()
    }
  }

  protected markConfigDirty (): void {
    this.configDirty = true
  }

  protected normalizeTransactionValue (value: number | string | undefined): number {
    if (value === undefined || value === null) {
      return 0
    }

    const numericValue = Number(value)

    if (!Number.isFinite(numericValue)) {
      return 0
    }

    return Math.round(numericValue * ATOMIC_UNITS_PER_COIN)
  }

  public static resolveServerConfig (walletConfig: WalletConfigItem): ElectrumServerConfig {
    const parsed = parseElectrumServer(walletConfig.electrumServer)
    if (!parsed) {
      throw new Error('Invalid ElectrumX server configuration for wallet')
    }

    return parsed
  }
}
