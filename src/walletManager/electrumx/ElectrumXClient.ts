import crypto from 'crypto'
import net from 'net'
import tls from 'tls'
import Log from 'electron-log'
// @ts-ignore
import Bitcore from 'bitcore-lib'
import { ElectrumServerConfig } from '@/utils/electrumServers'
import { connectViaTorSocks } from '@/walletManager/electrumx/socks'

export interface ElectrumBalance {
  confirmed: number
  unconfirmed: number
}

export interface ElectrumHistoryEntry {
  txHash: string
  height: number
}

export interface ElectrumListUnspentEntry {
  txHash: string
  vout: number
  value: number
  height: number
}

export interface ElectrumTransactionVin {
  txid?: string
  vout?: number
  coinbase?: string
}

export interface ElectrumTransactionVout {
  value: number
  n: number
  scriptPubKey?: {
    addresses?: string[]
    address?: string
    hex?: string
  }
}

export interface ElectrumTransaction {
  txid: string
  hash?: string
  hex?: string
  confirmations?: number
  blockhash?: string
  blocktime?: number
  time?: number
  locktime?: number
  size?: number
  vin: ElectrumTransactionVin[]
  vout: ElectrumTransactionVout[]
}

const MAX_IN_FLIGHT_REQUESTS = 4
const CONNECTION_TIMEOUT_MS = 12000
const REQUEST_TIMEOUT_MS = 45000

interface PendingElectrumRequest {
  method: string
  resolve: (value: any) => void
  reject: (error: Error) => void
  timeout: NodeJS.Timeout
}

interface ElectrumRequestQueue {
  active: number
  waiting: Array<() => void>
}

type ElectrumSubscriptionHandler = (address: string, status: string | null) => void

export default class ElectrumXClient {
  protected static requestQueues: Map<string, ElectrumRequestQueue> = new Map()
  protected server: ElectrumServerConfig
  protected requestCounter: number
  protected useTor: boolean
  protected socket: net.Socket | tls.TLSSocket | null
  protected connectPromise: Promise<net.Socket | tls.TLSSocket> | null
  protected responseBuffer: string
  protected pendingRequests: Map<number, PendingElectrumRequest>
  protected subscriptionHandlers: Map<string, Set<ElectrumSubscriptionHandler>>
  protected subscriptionStatuses: Map<string, string | null>
  protected subscriptionAddresses: Map<string, string>
  protected activeSubscriptions: Set<string>
  protected subscriptionRequests: Map<string, Promise<void>>

  constructor (server: ElectrumServerConfig, useTor: boolean = true) {
    this.server = server
    this.requestCounter = 0
    this.useTor = useTor
    this.socket = null
    this.connectPromise = null
    this.responseBuffer = ''
    this.pendingRequests = new Map()
    this.subscriptionHandlers = new Map()
    this.subscriptionStatuses = new Map()
    this.subscriptionAddresses = new Map()
    this.activeSubscriptions = new Set()
    this.subscriptionRequests = new Map()
  }

  public async ping (): Promise<string> {
    await this.request<any>('server.ping', [])
    return 'ok'
  }

  public getServer (): ElectrumServerConfig {
    return this.server
  }

  public async getBalance (address: string): Promise<ElectrumBalance> {
    return this.request<ElectrumBalance>('blockchain.scripthash.get_balance', [this.toScriptHash(address)])
  }

  public async getHistory (address: string): Promise<ElectrumHistoryEntry[]> {
    const entries = await this.request<Array<Record<string, any>>>(
      'blockchain.scripthash.get_history',
      [this.toScriptHash(address)]
    )

    return entries.map(entry => ({
      // eslint-disable-next-line dot-notation
      txHash: String(entry['tx_hash']),
      height: Number(entry.height || 0)
    }))
  }

  public async listUnspent (address: string): Promise<ElectrumListUnspentEntry[]> {
    const entries = await this.request<Array<Record<string, any>>>(
      'blockchain.scripthash.listunspent',
      [this.toScriptHash(address)]
    )

    return entries.map(entry => ({
      // eslint-disable-next-line dot-notation
      txHash: String(entry['tx_hash']),
      // eslint-disable-next-line dot-notation
      vout: Number(entry['tx_pos']),
      value: Number(entry.value || 0),
      height: Number(entry.height || 0)
    }))
  }

  public async getTransaction (txid: string, verbose: boolean = true): Promise<ElectrumTransaction | string> {
    return this.request<ElectrumTransaction | string>('blockchain.transaction.get', [txid, verbose])
  }

  public async estimateFee (targetBlocks: number = 1): Promise<number> {
    const value = await this.request<number | string | null>('blockchain.estimatefee', [targetBlocks])
    return Number(value || 0)
  }

  public async broadcastTransaction (rawTransaction: string): Promise<string> {
    return this.request<string>('blockchain.transaction.broadcast', [rawTransaction])
  }

  public async subscribeAddress (
    address: string,
    handler: ElectrumSubscriptionHandler
  ): Promise<() => void> {
    const scriptHash = this.toScriptHash(address)
    const handlers = this.subscriptionHandlers.get(scriptHash) || new Set<ElectrumSubscriptionHandler>()
    handlers.add(handler)
    this.subscriptionHandlers.set(scriptHash, handlers)
    this.subscriptionAddresses.set(scriptHash, address)

    await this.ensureSubscription(scriptHash)

    return () => {
      const currentHandlers = this.subscriptionHandlers.get(scriptHash)

      if (!currentHandlers) {
        return
      }

      currentHandlers.delete(handler)

      if (currentHandlers.size === 0) {
        this.subscriptionHandlers.delete(scriptHash)
      }
    }
  }

  protected async queueRequest<T> (task: () => Promise<T>): Promise<T> {
    const queue = this.getRequestQueue()
    await this.acquireRequestSlot(queue)

    try {
      return await task()
    } finally {
      this.releaseRequestSlot(queue)
    }
  }

  protected getQueueKey (): string {
    return `${this.server.protocol}:${this.server.host}:${this.server.port}`
  }

  protected getRequestQueue (): ElectrumRequestQueue {
    const queueKey = this.getQueueKey()
    const existing = ElectrumXClient.requestQueues.get(queueKey)

    if (existing) {
      return existing
    }

    const queue = {
      active: 0,
      waiting: []
    }

    ElectrumXClient.requestQueues.set(queueKey, queue)
    return queue
  }

  protected async acquireRequestSlot (queue: ElectrumRequestQueue): Promise<void> {
    if (queue.active < MAX_IN_FLIGHT_REQUESTS) {
      queue.active++
      return
    }

    await new Promise<void>(resolve => {
      queue.waiting.push(resolve)
    })
  }

  protected releaseRequestSlot (queue: ElectrumRequestQueue): void {
    const next = queue.waiting.shift()

    if (next) {
      next()
      return
    }

    queue.active = Math.max(queue.active - 1, 0)
  }

  protected toScriptHash (address: string): string {
    const script = Bitcore.Script.buildPublicKeyHashOut(address).toBuffer()
    const digest = crypto.createHash('sha256').update(script).digest()
    return Buffer.from(digest).reverse().toString('hex')
  }

  protected async request<T> (method: string, params: any[] = []): Promise<T> {
    return this.queueRequest(() => this.performRequest<T>(method, params))
  }

  protected async ensureSubscription (scriptHash: string): Promise<void> {
    if (this.activeSubscriptions.has(scriptHash)) {
      return
    }

    const pendingRequest = this.subscriptionRequests.get(scriptHash)

    if (pendingRequest) {
      return pendingRequest
    }

    const request = this.request<string | null>('blockchain.scripthash.subscribe', [scriptHash])
      .then(status => {
        this.subscriptionStatuses.set(scriptHash, status)
        this.activeSubscriptions.add(scriptHash)
      })
      .finally(() => {
        this.subscriptionRequests.delete(scriptHash)
      })

    this.subscriptionRequests.set(scriptHash, request)
    return request
  }

  protected async performRequest<T> (method: string, params: any[] = []): Promise<T> {
    Log.info(`ElectrumX request ${method} -> ${this.server.host}:${this.server.port} (${this.server.protocol})`)

    const socket = await this.ensureSocket()

    return this.sendSocketRequest<T>(socket, method, params)
  }

  protected sendSocketRequest<T> (socket: net.Socket | tls.TLSSocket, method: string, params: any[] = []): Promise<T> {
    const id = ++this.requestCounter
    const payload = JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n'

    return new Promise<T>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(id)
        reject(new Error(`ElectrumX request timed out: ${method}`))
      }, REQUEST_TIMEOUT_MS)

      this.pendingRequests.set(id, {
        method,
        resolve,
        reject,
        timeout
      })

      socket.write(payload, error => {
        if (error) {
          this.pendingRequests.delete(id)
          clearTimeout(timeout)
          reject(error)
        }
      })
    })
  }

  protected async ensureSocket (): Promise<net.Socket | tls.TLSSocket> {
    if (this.socket && !this.socket.destroyed) {
      return this.socket
    }

    if (this.connectPromise) {
      return this.connectPromise
    }

    this.connectPromise = this.createSocket()
      .then(async socket => {
        this.bindPersistentSocket(socket)
        this.socket = socket
        this.connectPromise = null
        Log.info(`ElectrumX connected ${this.server.host}:${this.server.port} (${this.server.protocol})`)
        await this.identifyClient(socket)
        await this.restoreSubscriptions()
        return socket
      })
      .catch(error => {
        this.connectPromise = null
        throw error
      })

    return this.connectPromise
  }

  protected async identifyClient (socket: net.Socket | tls.TLSSocket): Promise<void> {
    await this.sendSocketRequest(socket, 'server.version', ['VergeSlim', '1.4'])
    Log.info(`ElectrumX identified client with ${this.server.host}:${this.server.port}`)
  }

  protected async restoreSubscriptions (): Promise<void> {
    const scriptHashes = Array.from(this.subscriptionHandlers.keys())

    if (scriptHashes.length === 0) {
      return
    }

    await Promise.all(scriptHashes.map(scriptHash => this.ensureSubscription(scriptHash)))
    Log.info(`ElectrumX restored ${scriptHashes.length} subscriptions with ${this.server.host}:${this.server.port}`)
  }

  protected bindPersistentSocket (socket: net.Socket | tls.TLSSocket): void {
    this.responseBuffer = ''
    socket.setTimeout(60000)

    socket.on('data', chunk => this.handleSocketData(chunk))
    socket.on('timeout', () => {
      this.dropSocket(new Error(`ElectrumX connection timed out: ${this.server.host}:${this.server.port}`))
    })
    socket.on('error', error => {
      this.dropSocket(error)
    })
    socket.on('end', () => {
      this.dropSocket(new Error(`ElectrumX connection ended: ${this.server.host}:${this.server.port}`))
    })
    socket.on('close', () => {
      this.dropSocket(new Error(`ElectrumX connection closed: ${this.server.host}:${this.server.port}`))
    })
  }

  protected handleSocketData (chunk: Buffer): void {
    this.responseBuffer += chunk.toString()
    const lines = this.responseBuffer.split('\n')
    this.responseBuffer = lines.pop() || ''

    for (const line of lines) {
      if (!line.trim()) {
        continue
      }

      let parsed: any

      try {
        parsed = JSON.parse(line)
      } catch (error) {
        this.dropSocket(error as Error)
        return
      }

      if (parsed.method === 'blockchain.scripthash.subscribe') {
        this.handleSubscriptionNotification(parsed.params || [])
        continue
      }

      const pending = this.pendingRequests.get(Number(parsed.id))

      if (!pending) {
        continue
      }

      this.pendingRequests.delete(Number(parsed.id))
      clearTimeout(pending.timeout)

      if (parsed.error) {
        Log.warn(`ElectrumX request ${pending.method} rejected by ${this.server.host}:${this.server.port}: ${parsed.error.message || 'unknown error'}`)
        pending.reject(new Error(parsed.error.message || `ElectrumX ${pending.method} failed`))
        continue
      }

      Log.info(`ElectrumX request ${pending.method} completed`)
      pending.resolve(parsed.result)
    }
  }

  protected handleSubscriptionNotification (params: any[]): void {
    const scriptHash = String(params[0] || '')
    const status = params.length > 1 && params[1] !== undefined && params[1] !== null
      ? String(params[1])
      : null

    if (!scriptHash || !this.subscriptionHandlers.has(scriptHash)) {
      return
    }

    const previousStatus = this.subscriptionStatuses.get(scriptHash)
    this.subscriptionStatuses.set(scriptHash, status)

    if (previousStatus === status) {
      return
    }

    const address = this.subscriptionAddresses.get(scriptHash) || scriptHash

    for (const handler of this.subscriptionHandlers.get(scriptHash) || []) {
      try {
        handler(address, status)
      } catch (error) {
        Log.warn(`ElectrumX subscription handler failed for ${address}: ${String(error)}`)
      }
    }
  }

  protected dropSocket (error: Error): void {
    if (!this.socket && this.pendingRequests.size === 0) {
      return
    }

    const socket = this.socket
    this.socket = null
    this.responseBuffer = ''
    this.activeSubscriptions.clear()
    this.subscriptionStatuses.clear()
    this.subscriptionRequests.clear()

    if (socket) {
      socket.removeAllListeners()
      socket.destroy()
    }

    for (const pending of this.pendingRequests.values()) {
      clearTimeout(pending.timeout)
      pending.reject(error)
    }

    this.pendingRequests.clear()
  }

  protected async createSocket (): Promise<net.Socket | tls.TLSSocket> {
    return this.withTimeout(this.openSocket(), CONNECTION_TIMEOUT_MS, `ElectrumX connection timed out: ${this.server.host}:${this.server.port}`)
  }

  protected async openSocket (): Promise<net.Socket | tls.TLSSocket> {
    const baseSocket = this.useTor
      ? await connectViaTorSocks(this.server.host, this.server.port)
      : await this.connectDirect()

    if (this.server.protocol !== 'ssl') {
      return baseSocket
    }

    return new Promise<tls.TLSSocket>((resolve, reject) => {
      const secureSocket = tls.connect({
        socket: baseSocket,
        servername: this.server.host
      }, () => {
        resolve(secureSocket)
      })

      secureSocket.once('error', reject)
    })
  }

  protected connectDirect (): Promise<net.Socket> {
    return new Promise((resolve, reject) => {
      const socket = net.connect({
        host: this.server.host,
        port: this.server.port
      })

      const cleanup = () => {
        socket.removeListener('connect', onConnect)
        socket.removeListener('error', onError)
      }

      const onConnect = () => {
        cleanup()
        resolve(socket)
      }

      const onError = (error: Error) => {
        cleanup()
        reject(error)
      }

      socket.once('connect', onConnect)
      socket.once('error', onError)
    })
  }

  protected async withTimeout<T> (promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
    let timeout: NodeJS.Timeout | null = null

    try {
      return await Promise.race([
        promise,
        new Promise<T>((resolve, reject) => {
          if (resolve === null) {
            return
          }
          timeout = setTimeout(() => reject(new Error(message)), timeoutMs)
        })
      ])
    } finally {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }
}
