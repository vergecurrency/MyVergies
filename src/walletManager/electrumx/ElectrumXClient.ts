import crypto from 'crypto'
import net from 'net'
import tls from 'tls'
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

export default class ElectrumXClient {
  protected server: ElectrumServerConfig
  protected requestCounter: number
  protected useTor: boolean

  constructor (server: ElectrumServerConfig, useTor: boolean = true) {
    this.server = server
    this.requestCounter = 0
    this.useTor = useTor
  }

  public async ping (): Promise<string> {
    const result = await this.request<any>('server.version', ['VergeSlim', '1.4'])

    if (Array.isArray(result)) {
      return result.join(' / ')
    }

    return String(result || 'unknown')
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

  protected toScriptHash (address: string): string {
    const script = Bitcore.Script.buildPublicKeyHashOut(address).toBuffer()
    const digest = crypto.createHash('sha256').update(script).digest()
    return Buffer.from(digest).reverse().toString('hex')
  }

  protected async request<T> (method: string, params: any[] = []): Promise<T> {
    const id = ++this.requestCounter
    const helloId = method === 'server.version' ? null : ++this.requestCounter
    const payload = JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n'
    const helloPayload = helloId === null
      ? ''
      : JSON.stringify({
        jsonrpc: '2.0',
        id: helloId,
        method: 'server.version',
        params: ['VergeSlim', '1.4']
      }) + '\n'

    return new Promise<T>((resolve, reject) => {
      let socket: net.Socket | tls.TLSSocket | null = null
      let responseBuffer = ''
      let settled = false

      const finalize = (handler: () => void) => {
        if (settled) {
          return
        }

        settled = true
        if (socket) {
          socket.removeAllListeners()
          socket.destroy()
        }
        handler()
      }

      const bindSocket = (boundSocket: net.Socket | tls.TLSSocket) => {
        socket = boundSocket
        socket.setTimeout(12000)

        socket.on('data', chunk => {
          responseBuffer += chunk.toString()
          const lines = responseBuffer.split('\n')
          responseBuffer = lines.pop() || ''

          for (const line of lines) {
            if (!line.trim()) {
              continue
            }

            try {
              const parsed = JSON.parse(line)

              if (parsed.id !== id) {
                if (helloId !== null && parsed.id === helloId) {
                  if (parsed.error) {
                    finalize(() => reject(new Error(parsed.error.message || 'ElectrumX server rejected client identification')))
                  }
                  continue
                }

                continue
              }

              if (parsed.error) {
                finalize(() => reject(new Error(parsed.error.message || `ElectrumX ${method} failed`)))
                return
              }

              finalize(() => resolve(parsed.result as T))
              return
            } catch (error) {
              finalize(() => reject(error))
              return
            }
          }
        })

        socket.on('timeout', () => {
          finalize(() => reject(new Error(`ElectrumX request timed out: ${method}`)))
        })

        socket.on('error', error => {
          finalize(() => reject(error))
        })

        socket.on('end', () => {
          if (!settled) {
            finalize(() => reject(new Error(`ElectrumX connection ended before reply: ${method}`)))
          }
        })
      }

      this.createSocket().then(createdSocket => {
        bindSocket(createdSocket)

        if (!socket) {
          finalize(() => reject(new Error('ElectrumX socket was not created')))
          return
        }

        if (helloPayload) {
          socket.write(helloPayload)
        }

        socket.write(payload)
      }).catch(error => {
        finalize(() => reject(error))
      })
    })
  }

  protected async createSocket (): Promise<net.Socket | tls.TLSSocket> {
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
}
