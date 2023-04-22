import { defineStore } from 'pinia'

export const useToastStore = defineStore('useToastStore', () => {
  const { $i18n } = useNuxtApp()

  const toasts = ref([])
  const sortedToasts = computed(() => [...toasts.value].sort((a, b) => b.key - a.key))

  function remove (key) {
    toasts.value = toasts.value.filter(obj => obj.key !== key)
  }

  function add (toast) {
    const key = toasts.value.length
    const timeout = toast.timeout || 5000
    const titleExists = toasts.value.findIndex(({ title }) => title === toast.title) > -1

    if (!titleExists) {
      toasts.value = [...toasts.value, { ...toast, key }]
    }

    if (toast.timed) {
      setTimeout(() => {
        toasts.value = toasts.value.filter(obj => obj.key !== key)
      }, timeout)
    }
    return key
  }

  function success (success) {
    return add({
      ...success,
      actions: success.actions || [],
      times: success.timed || true,
      type: 'success'
    })
  }

  function warn (warn) {
    return add({
      ...warn,
      actions: warn.actions || [],
      times: warn.timed || true,
      type: 'warn'
    })
  }

  function error (error = {}) {
    return add({
      ...error,
      title: error.title || $i18n.t('error.general.title'),
      text: error.text || $i18n.t('error.general.text'),
      actions: error.actions || [],
      times: error.timed || true,
      type: 'error'
    })
  }

  function info (info) {
    return add({
      ...info,
      actions: info.actions || [],
      times: info.timed || true,
      type: 'info'
    })
  }

  return {
    toasts,
    sortedToasts,
    remove,
    add,
    success,
    warn,
    error,
    info
  }
})
