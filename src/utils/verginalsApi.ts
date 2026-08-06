import constants from '@/utils/constants'

export const getDefaultVerginalsApiUrl = (): string => constants.verginalsApi

export const normalizeVerginalsApiUrl = (value?: string): string => {
  const url = (value || getDefaultVerginalsApiUrl()).trim()

  return url.replace(/\/+$/, '')
}

export const isValidVerginalsApiUrl = (value?: string): boolean => {
  if (!value) {
    return false
  }

  try {
    const url = new URL(normalizeVerginalsApiUrl(value))

    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch (error) {
    return false
  }
}

export const buildVerginalsApiUrl = (baseUrl: string, path: string): string => {
  const base = normalizeVerginalsApiUrl(baseUrl)
  const suffix = path.startsWith('/') ? path : `/${path}`

  return `${base}${suffix}`
}
