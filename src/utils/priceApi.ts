import axios from 'axios'
import constants from '@/utils/constants'

export const fetchXvgPrice = async (currencyCode: string): Promise<number> => {
  const currency = currencyCode.toLowerCase()

  try {
    return await fetchCoinGeckoPrice(currency)
  } catch (_error) {
    // Fall through when CoinGecko rate-limits or is unreachable.
  }

  try {
    return await fetchCoinMarketCapPrice(currencyCode.toUpperCase())
  } catch (_error) {
    // Fall back to the Verge-hosted endpoint if external providers fail.
  }

  return fetchVergePrice(currencyCode)
}

const fetchCoinGeckoPrice = async (currency: string): Promise<number> => {
  const response = await axios.get(constants.coinGeckoPriceApi, {
    timeout: 15000,
    params: {
      ids: 'verge',
      vs_currencies: currency
    },
    headers: {
      accept: 'application/json'
    }
  })
  const price = response.data && response.data.verge ? Number(response.data.verge[currency]) : 0

  if (price <= 0) {
    throw new Error('CoinGecko did not return an XVG price')
  }

  return price
}

const fetchCoinMarketCapPrice = async (currency: string): Promise<number> => {
  const response = await axios.get(constants.coinMarketCapPriceApi, {
    timeout: 15000,
    params: {
      start: 1,
      limit: 500,
      convert: currency
    },
    headers: {
      accept: 'application/json'
    }
  })
  const coins = Array.isArray(response.data && response.data.data) ? response.data.data : []
  const xvg = coins.find((coin: any) => coin && coin.symbol === 'XVG')
  const quote = xvg && xvg.quote ? xvg.quote[currency] : null
  const price = quote ? Number(quote.price) : 0

  if (price <= 0) {
    throw new Error('CoinMarketCap did not return an XVG price')
  }

  return price
}

const fetchVergePrice = async (currencyCode: string): Promise<number> => {
  const response = await axios.get(`${constants.priceApi}/${currencyCode}`, {
    timeout: 15000
  })

  return Number(response.data.price)
}
