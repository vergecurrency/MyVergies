export const DECIMAL_PER_SATOSHI = 6

export const getFormattedCurrency = (amount: number, lang: string) =>
  new Intl.NumberFormat(lang, {
    style: 'currency',
    currency: lang.includes('de') ? 'EUR' : 'USD'
  }).format(amount)

export const getFromattedCrypto = (amount: number, lang: string, coin: any) =>
  new Intl.NumberFormat(lang, {
    style: 'currency',
    currency: coin
  }).format(amount)

export const formatAmountFromSatoshis = (satoshis: number, lang: string) => {
  return getFromattedCrypto(satoshis / 10 ** DECIMAL_PER_SATOSHI, lang, 'XVG')
}
