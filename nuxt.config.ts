import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  components: {
    global: true,
    dirs: ['~/components/atoms', '~/components/molecules', '~/components/organisms'],
  },
  css: ['@/assets/css/global.css'],
  buildModules: ['@nuxtjs/tailwindcss'],
  modules: ['@nuxtjs/supabase', '@pinia/nuxt'],
  vite: {
    plugins: [svgLoader()],
  },
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: '~/tailwind.config.js',
    injectPosition: 0,
    viewer: false,
  },
})
