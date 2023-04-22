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
    ['@funken-studio/sitemap-nuxt-3',
      {
        hostname: process.env.NUXT_PUBLIC_SITE_URL,
        cacheTime: 1,
        generateOnBuild: true,
        defaults: {
          changefreq: 'daily',
          priority: 1,
          lastmod: new Date().toISOString()
        }
      }],
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
      appDomain: process.env.NODE_ENV === 'production'
        ? process.env.NUXT_PUBLIC_SITE_URL
        : 'http://localhost:3000',
      stripePk: process.env.STRIPE_PK,
      stripeMediorMonthly: process.env.STRIPE_MEDIOR_MONTHLY,
      stripeMediorYearly: process.env.STRIPE_MEDIOR_YEARLY,
      stripeProMonthly: process.env.STRIPE_PRO_MONTHLY,
      stripeProYearly: process.env.STRIPE_PRO_YEARLY
    },
    stripeSk: process.env.STRIPE_SK
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
    configPath: '~/tailwind.config.js',
    injectPosition: 0,
    viewer: false,
    exposeConfig: true
  },
  nitro: {
    compressPublicAssets: true
  }
})
