import UnheadVite from '@unhead/addons/vite'
import en from './locales/en.json'
import nl from './locales/nl.json'

export default defineNuxtConfig({
  components: {
    global: true,
    dirs: [
      '~/components/atoms',
      '~/components/molecules',
      '~/components/organisms',
      '~/components/templates'
    ]
  },
  css: ['@/assets/css/global.css'],
  modules: [
    'nuxt-icon',
    'nuxt-schema-org',
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@formkit/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/image-edge',
    'nuxt-simple-sitemap',
    '@vite-pwa/nuxt',
    ['nuxt-mail', {
      message: {
        to: 'jeremy@dnd-tracker.com' // default fallback
      },
      smtp: {
        service: 'gmail',
        auth: {
          user: process.env.MAIL,
          pass: process.env.MAIL_PASSWORD
        }
      }
    }]
  ],
  runtimeConfig: {
    public: {
      beta: process.env.BETA,
      appDomain: process.env.NODE_ENV === 'production' ? process.env.NUXT_PUBLIC_SITE_URL : 'http://localhost:3000',
      siteUrl: process.env.NODE_ENV === 'production' ? process.env.NUXT_PUBLIC_SITE_URL : 'http://localhost:3000',
      stripePk: process.env.STRIPE_PK,
      stripeMediorMonthly: process.env.STRIPE_MEDIOR_MONTHLY,
      stripeMediorYearly: process.env.STRIPE_MEDIOR_YEARLY,
      stripeProMonthly: process.env.STRIPE_PRO_MONTHLY,
      stripeProYearly: process.env.STRIPE_PRO_YEARLY,
      logRocket: process.env.LOGROCKET_ID
    },
    stripeSk: process.env.STRIPE_SK
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'DND-TRACKER',
      short_name: 'TRACKER',
      description: 'Effortless Battle Management',
      background_color: '#2A303C',
      theme_color: '#21252E',
      start_url: 'https://dnd-tracker.com',
      lang: 'en',
      icons: [
        {
          src: 'pwa-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: 'pwa-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    client: {
      installPrompt: true
    }
  },
  vite: {
    plugins: [UnheadVite()]
  },
  formkit: {
    configFile: './formkit.config.ts'
  },
  i18n: {
    defaultLocale: 'nl',
    locales: [
      { code: 'nl', iso: 'nl-BE', name: 'Nederlands', icon: '🇧🇪' },
      { code: 'en', iso: 'en-US', name: 'English', icon: '🇬🇧' }
    ],
    vueI18n: {
      missingWarn: false,
      legacy: false,
      locale: 'nl',
      fallbackLocale: 'nl',
      messages: { en, nl }
    }
  },
  schemaOrg: {
    host: process.env.NUXT_PUBLIC_SITE_URL
  },
  image: {
    imagekit: {
      baseURL: 'https://ik.imagekit.io/c2es1qasw'
    }
  },
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: '~/tailwind.config.ts',
    injectPosition: 0,
    viewer: false,
    exposeConfig: true
  },
  nitro: {
    compressPublicAssets: true
  }
})
