export interface ElectrumServerConfig {
  id: string
  label: string
  host: string
  port: number
  protocol: 'ssl' | 'tcp'
  source: 'default' | 'custom'
}

const DEFAULT_ELECTRUM_SERVERS: ElectrumServerConfig[] = [
  {
    id: 'electrum-verge-cloud-ssl',
    label: 'electrum-verge.cloud',
    host: 'electrum-verge.cloud',
    port: 50002,
    protocol: 'ssl',
    source: 'default'
  },
  {
    id: 'electrumx-verge-cloud-ssl',
    label: 'electrumx-verge.cloud',
    host: 'electrumx-verge.cloud',
    port: 50002,
    protocol: 'ssl',
    source: 'default'
  }
]

const ELECTRUM_SERVER_ID_PATTERN = /^[a-z0-9-]+$/i

export const getDefaultElectrumServers = (): ElectrumServerConfig[] => {
  return DEFAULT_ELECTRUM_SERVERS.map(server => ({ ...server }))
}

export const getDefaultElectrumServerId = (): string => {
  return DEFAULT_ELECTRUM_SERVERS[0].id
}

export const normalizeElectrumServer = (server: Partial<ElectrumServerConfig>): ElectrumServerConfig => {
  const host = String(server.host || '').trim().toLowerCase()
  const protocol = server.protocol === 'tcp' ? 'tcp' : 'ssl'
  const port = Number(server.port)
  const source = server.source === 'custom' ? 'custom' : 'default'
  const label = String(server.label || host).trim() || host
  const fallbackId = `${host.replace(/[^a-z0-9]+/gi, '-')}-${protocol}-${port}`
    .replace(/^-+|-+$/g, '')
    .toLowerCase()

  return {
    id: String(server.id || fallbackId),
    label,
    host,
    port,
    protocol,
    source
  }
}

export const isValidElectrumServer = (server: Partial<ElectrumServerConfig>): boolean => {
  if (!server) {
    return false
  }

  const normalized = normalizeElectrumServer(server)

  if (!normalized.host || normalized.host.includes(' ')) {
    return false
  }

  if (!Number.isInteger(normalized.port) || normalized.port < 1 || normalized.port > 65535) {
    return false
  }

  if (!ELECTRUM_SERVER_ID_PATTERN.test(normalized.id)) {
    return false
  }

  return normalized.protocol === 'ssl' || normalized.protocol === 'tcp'
}

export const serializeElectrumServer = (server: Partial<ElectrumServerConfig>): string => {
  const normalized = normalizeElectrumServer(server)
  return `${normalized.protocol}://${normalized.host}:${normalized.port}`
}

export const parseElectrumServer = (value?: string | null): ElectrumServerConfig | null => {
  const raw = String(value || '').trim()

  if (!raw) {
    return null
  }

  const match = raw.match(/^(ssl|tcp):\/\/([^/:]+):(\d{1,5})$/i)
  if (!match) {
    return null
  }

  const [, protocol, host, port] = match
  const server = normalizeElectrumServer({
    host,
    port: Number(port),
    protocol: protocol.toLowerCase() === 'tcp' ? 'tcp' : 'ssl',
    source: 'custom'
  })

  return isValidElectrumServer(server) ? server : null
}

export const findElectrumServerById = (
  servers: ElectrumServerConfig[],
  serverId?: string | null
): ElectrumServerConfig | undefined => {
  return servers.find(server => server.id === serverId)
}
