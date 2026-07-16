import constants from '@/utils/constants'
import axios from 'axios'

const VWS_READINESS_TIMEOUT_MS = 10000

export const normalizeVwsApiUrl = (value: string = ''): string => {
  const normalized = value.trim()

  if (normalized === '') {
    return ''
  }

  return normalized.replace(/\/+$/, '')
}

export const getDefaultVwsApiUrl = (): string => normalizeVwsApiUrl(constants.vwsApi)

export const resolveVwsApiUrl = (value?: string | null): string => {
  const normalized = normalizeVwsApiUrl(value || '')

  return normalized || getDefaultVwsApiUrl()
}

export const isValidVwsApiUrl = (value: string): boolean => {
  const normalized = normalizeVwsApiUrl(value)

  if (normalized === '') {
    return false
  }

  try {
    const parsedUrl = new URL(normalized)

    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
  } catch (_error) {
    return false
  }
}

export const isVwsVersionResponse = (data: any): boolean => {
  return Boolean(
    data &&
    typeof data.serviceVersion === 'string' &&
    /^(?:bws|vws)-/i.test(data.serviceVersion)
  )
}

export const checkVwsApiReady = async (value: string): Promise<boolean> => {
  if (!isValidVwsApiUrl(value)) {
    return false
  }

  try {
    const response = await axios.get(`${resolveVwsApiUrl(value)}/v1/version/`, {
      timeout: VWS_READINESS_TIMEOUT_MS
    })

    return isVwsVersionResponse(response.data)
  } catch (_error) {
    return false
  }
}
