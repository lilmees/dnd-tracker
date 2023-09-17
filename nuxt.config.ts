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
      '~/components/templates',
      '~/components/tableRow',
      '~/components/skeletons'
    ]
  },
  css: [
    '@/assets/css/global.css',
    '@/assets/css/quill.css'
  ],
  modules: [
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
  extends: ['nuxt-umami'],
  runtimeConfig: {
    public: {
      beta: process.env.BETA,
      appDomain: process.env.NODE_ENV === 'production' ? process.env.NUXT_PUBLIC_SITE_URL : 'http://localhost:3000',
      siteUrl: process.env.NODE_ENV === 'production' ? process.env.NUXT_PUBLIC_SITE_URL : 'http://localhost:3000',
      stripeMediorMonthly: process.env.STRIPE_MEDIOR_MONTHLY,
      stripeMediorYearly: process.env.STRIPE_MEDIOR_YEARLY,
      stripeProMonthly: process.env.STRIPE_PRO_MONTHLY,
      stripeProYearly: process.env.STRIPE_PRO_YEARLY,
      logRocket: process.env.LOGROCKET_ID,
      formkit: process.env.FORMKIT_PRO
    }
  },
  appConfig: {
    umami: {
      version: 2
    }
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
          type: 'image/png'
        },
        {
          src: '/pwa-512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/pwa-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
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
  pinia: {
    autoImports: [
      'defineStore',
      ['defineStore', 'definePiniaStore'],
      'storeToRefs'
    ]
  },
  supabase: {
    redirect: false
  },
  imports: {
    dirs: ['store']
  },
  nitro: {
    compressPublicAssets: true
  },
  devtools: {
    enabled: true
  },
  security: {
    headers: {
      contentSecurityPolicy: {
        'img-src': ['\'self\'', 'https:', 'data:'],
        'frame-ancestors': ['\'self\'', 'https:', 'data:']
      },
      crossOriginEmbedderPolicy: false
    }
  },
  stripe: {
    server: {
      key: process.env.STRIPE_SK,
      options: {
        apiVersion: '2022-11-15'
      }
    },
    client: {
      key: process.env.STRIPE_PK,
      options: {
        apiVersion: '2022-11-15'
      }
    }
  }
})
