import { createIPX, createIPXMiddleware } from 'ipx'
const ipx = createIPX({
  dir: './assets/images', // absolute path to images dir
  domains: [], // allowed external domains (should match domains option in nuxt.config)
  alias: {}, // base alias
  sharp: {}, // sharp options
})
export default createIPXMiddleware(ipx)