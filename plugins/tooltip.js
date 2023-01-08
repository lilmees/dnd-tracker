import VueTippy from 'vue-tippy'
import 'tippy.js/dist/tippy.css'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(VueTippy)
})
