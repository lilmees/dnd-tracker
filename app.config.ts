export default defineAppConfig({
  umami: {
    host: process.env.NUXT_PUBLIC_SITE_URL,
    id: process.env.NUXT_PUBLIC_UMAMI_ID
  }
})
