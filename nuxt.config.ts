import svgLoader from 'vite-svg-loader'
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
    ],
  },
  css: [ '@/assets/css/global.css' ],
  build: {
    transpile: []
  },
  modules: [
    '@nuxtjs/supabase', 
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt', 
    '@pinia/nuxt', 
    '@formkit/nuxt', 
    '@nuxtjs/i18n',
    '@vueuse/motion/nuxt'
  ],
  runtimeConfig: {
    public: {
      supabaseRedirectUrl: process.env.NUXT_SUPABASE_REDIRECT_URL,
    },
  },
  vite: {
    plugins: [svgLoader()],
  },
  formkit: {
    configFile: './formkit.config.ts',
  },
  i18n: {
    defaultLocale: 'nl',
    locales: [
      { code: 'nl', iso: 'nl-BE', name: 'Nederlands',icon: '🇧🇪' },
      { code: 'en', iso: 'en-US', name: 'English', icon: '🇬🇧' },
    ],
    vueI18n: {
      legacy: false,
      locale: 'nl',
      fallbackLocale: 'nl',
      messages: { en, nl},
    },
  },
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: '~/tailwind.config.js',
    injectPosition: 0,
    viewer: false,
    exposeConfig: true,
  },
  nitro: {
    compressPublicAssets: true,
  },
})
