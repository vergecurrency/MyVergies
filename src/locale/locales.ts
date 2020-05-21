const files = require.context('@/assets/locales/', false, /\.ts$/)
const locales = {}

files.keys().forEach(key => {
  if (key === './index.ts') return
  // @ts-ignore
  locales[key.replace(/(\.\/|\.ts)/g, '')] = files(key).default
})

export default locales
