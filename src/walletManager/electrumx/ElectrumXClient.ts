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

const REQUEST_SPACING_MS = 250
const CONNECTION_TIMEOUT_MS = 12000
const REQUEST_TIMEOUT_MS = 45000

interface PendingElectrumRequest {
  method: string
  resolve: (value: any) => void
  reject: (error: Error) => void
  timeout: NodeJS.Timeout
}

export default class ElectrumXClient {
  protected static requestQueue: Promise<void> = Promise.resolve()
  protected server: ElectrumServerConfig
  protected requestCounter: number
  protected useTor: boolean
  protected socket: net.Socket | tls.TLSSocket | null
  protected connectPromise: Promise<net.Socket | tls.TLSSocket> | null
  protected responseBuffer: string
  protected pendingRequests: Map<number, PendingElectrumRequest>

  constructor (server: ElectrumServerConfig, useTor: boolean = true) {
    this.server = server
    this.requestCounter = 0
    this.useTor = useTor
    this.socket = null
    this.connectPromise = null
    this.responseBuffer = ''
    this.pendingRequests = new Map()
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

  protected async queueRequest<T> (task: () => Promise<T>): Promise<T> {
    const previous = ElectrumXClient.requestQueue
    let releaseQueue: () => void = () => {}

    ElectrumXClient.requestQueue = new Promise(resolve => {
      releaseQueue = resolve
    })

    await previous

    try {
      return await task()
    } finally {
      setTimeout(releaseQueue, REQUEST_SPACING_MS)
    }
  }

  protected toScriptHash (address: string): string {
    const script = Bitcore.Script.buildPublicKeyHashOut(address).toBuffer()
    const digest = crypto.createHash('sha256').update(script).digest()
    return Buffer.from(digest).reverse().toString('hex')
  }

  protected async request<T> (method: string, params: any[] = []): Promise<T> {
    return this.queueRequest(() => this.performRequest<T>(method, params))
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

  protected dropSocket (error: Error): void {
    if (!this.socket && this.pendingRequests.size === 0) {
      return
    }

    const socket = this.socket
    this.socket = null
    this.responseBuffer = ''

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
