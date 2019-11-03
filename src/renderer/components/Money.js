export const DECIMAL_PER_SATOSHI = 6

export const getFormattedCurrency = (amount, lang) =>
  new Intl.NumberFormat(lang, {
    style: 'currency',
    currency: lang.includes('de') ? 'EUR' : 'USD'
  }).format(amount)

export const getFromattedCrypto = (amount, lang, coin) =>
  new Intl.NumberFormat(lang, {
    style: 'currency',
    currency: coin
  }).format(amount)

export const formatAmountFromSatoshis = (satoshis, lang) => {
  return getFromattedCrypto(satoshis / 10 ** DECIMAL_PER_SATOSHI, lang, 'XVG')
}
