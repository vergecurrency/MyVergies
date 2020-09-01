const files = require.context('@/assets/locales/', false, /\.ts$/)
const locales: any = {}
export const localeNames: any = {}

files.keys().forEach(key => {
  if (key === './index.ts') return

  const langCode = key.replace(/(\.\/|\.ts)/g, '')

  locales[langCode] = files(key).default
  localeNames[langCode] = files(key).default.name || langCode
})

export default locales
