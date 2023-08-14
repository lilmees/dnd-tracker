import VueTippy from 'vue-tippy'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/material.css'
import 'tippy.js/animations/shift-away.css'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(VueTippy, {
    defaultProps: {
      animation: 'shift-away',
      theme: 'material'
    }
  })
})
