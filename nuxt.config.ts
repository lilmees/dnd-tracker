export default defineNuxtConfig({
  components: {
    global: true,
    dirs: [
      '~/components/atoms',
      '~/components/molecules',
      '~/components/organisms',
      '~/components/templates',
      '~/components/tableRow',
      '~/components/map',
      '~/components/skeletons',
      '~/components/animations',
    ],
  },
  css: [
    '@/assets/css/global.css',
    '@/assets/css/tailwind.css',
    '@/assets/css/quill.css',
    '@/assets/css/driver.css',
    '@/assets/css/tippy.css',
  ],
  modules: [
    '@nuxt/content',
    'nuxt-particles',
    '@unlok-co/nuxt-stripe',
    'nuxt-security',
    'nuxt-icon',
    'nuxt-schema-org',
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@formkit/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap',
    '@vite-pwa/nuxt',
    '@vue-email/nuxt',
    '@nuxt/image',
    'nuxt-lazy-hydrate',
    '@nuxt/eslint',
  ],
  extends: ['nuxt-umami'],
  runtimeConfig: {
    public: {
      beta: process.env.BETA,
      appDomain: process.env.NODE_ENV === 'production' ? process.env.NUXT_PUBLIC_SITE_URL : 'http://localhost:3000',
      siteUrl: process.env.NODE_ENV === 'production' ? process.env.NUXT_PUBLIC_SITE_URL : 'http://localhost:3000',
      logRocket: process.env.LOGROCKET_ID,
      formkit: process.env.FORMKIT_PRO,
    },
    mailAddress: process.env.MAIL,
    mailPassword: process.env.MAIL_PASSWORD,
    stripeWebhook: process.env.STRIPE_WEBHOOK,
  },
  appConfig: {
    umami: { version: 2 },
  },
  eslint: {
    config: { stylistic: true },
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'DnD-Tracker',
      short_name: 'Tracker',
      description: 'Effortless Encounter Management',
      theme_color: '#21252E',
      background_color: '#2A303C',
      start_url: '/',
      lang: 'en',
      icons: [
        {
          src: '/pwa-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/pwa-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/pwa-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    client: { installPrompt: true },
  },
  formkit: { configFile: './formkit/config.ts' },
  i18n: {
    defaultLocale: 'nl',
    locales: [
      { code: 'nl', iso: 'nl-BE', name: 'Nederlands', icon: '🇧🇪' },
      { code: 'en', iso: 'en-US', name: 'English', icon: '🇬🇧' },
    ],
  },
  schemaOrg: { host: process.env.NUXT_PUBLIC_SITE_URL },
  image: {
    imagekit: { baseURL: 'https://ik.imagekit.io/c2es1qasw' },
  },
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: '~/tailwind.config.ts',
    injectPosition: 0,
    viewer: false,
    exposeConfig: true,
  },
  supabase: { redirect: false },
  imports: { dirs: ['store'] },
  nitro: { compressPublicAssets: true },
  devtools: { enabled: true },
  security: {
    headers: {
      contentSecurityPolicy: {
        'img-src': ['\'self\'', 'https:', 'data:', 'blob:'],
        'frame-ancestors': ['\'self\'', 'https:', 'data:'],
      },
      crossOriginEmbedderPolicy: false,
    },
  },
  stripe: {
    server: {
      key: process.env.STRIPE_SK,
      options: { apiVersion: '2023-08-16' },
    },
    client: {
      key: process.env.STRIPE_PK,
      options: { apiVersion: '2023-08-16' },
    },
  },
  vueEmail: {
    baseUrl: process.env.production ? process.env.NUXT_PUBLIC_SITE_URL : 'http://localhost:3000',
    i18n: { defaultLocale: 'en' },
  },
  sitemap: {
    autoI18n: false,
    credits: false,
  },
})
