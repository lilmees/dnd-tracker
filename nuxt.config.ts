import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  components: {
    global: true,
    dirs: ['~/components/atoms', '~/components/molecules', '~/components/organisms'],
  },
  css: ['@/assets/css/global.css'],
  buildModules: ['@nuxtjs/tailwindcss', '@intlify/nuxt3'],
  modules: ['@nuxtjs/supabase', '@pinia/nuxt', '@formkit/nuxt'],
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
  intlify: {
    localeDir: 'locales',
    vueI18n: {
      locale: 'nl',
    },
  },
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: '~/tailwind.config.js',
    injectPosition: 0,
    viewer: false,
  },
})
