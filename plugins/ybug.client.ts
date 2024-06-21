import Ybug from 'ybug-vue'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(Ybug, {
    id: 'x8sg2t11mj77w9bhat8k',
    settings: {
      hide_launcher: true,
      shortcut: true,
      widget_position: 'center',
    },
  })
})
