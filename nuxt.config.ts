import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  components: {
    global: true,
    dirs: ['~/components/atoms', '~/components/molecules', '~/components/organisms', '~/components/templates'],
  },
  css: ['@/assets/css/global.css', 'floating-vue/dist/style.css'],
  buildModules: ['@nuxtjs/tailwindcss', '@intlify/nuxt3', 'floating-vue/nuxt', '@nuxtjs/algolia'],
  modules: ['@nuxtjs/supabase', '@vueuse/nuxt', '@pinia/nuxt', '@formkit/nuxt', '@vueuse/motion/nuxt'],
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
  algolia: {
    apiKey: process.env.ALGOLIA_ADMIN_KEY,
    applicationId: process.env.ALGOLIA_APP_ID,
  },
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: '~/tailwind.config.js',
    injectPosition: 0,
    viewer: false,
  },
})
