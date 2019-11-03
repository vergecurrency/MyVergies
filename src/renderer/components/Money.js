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
