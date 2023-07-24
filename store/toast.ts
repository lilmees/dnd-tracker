export const useToastStore = defineStore('useToastStore', () => {
  const { $i18n } = useNuxtApp()

  const toasts = ref<Toast[]>([])

  function remove (key: number): void {
    toasts.value = toasts.value.filter(obj => obj.key !== key)
  }

  function add (toast: Toast): number {
    const key: number = Date.now()
    const timeout: number = toast.timeout || 5000
    const titleExists: boolean = toasts.value
      .findIndex(({ title }) => title === toast.title) > -1

    if (!titleExists) {
      if (toasts.value.length > 4) {
        toasts.value.shift()
      }

      toasts.value = [...toasts.value, { ...toast, key, timeout }]
    }

    return key
  }

  function success (success: Partial<Omit<Toast, 'key'>>): number {
    return add({
      ...success,
      actions: success.actions || [],
      timed: success.timed || true,
      type: 'success'
    } as Toast)
  }

  function warn (warn: Partial<Omit<Toast, 'key'>>): number {
    return add({
      ...warn,
      actions: warn.actions || [],
      timed: warn.timed || true,
      type: 'warn'
    } as Toast)
  }

  function error (error: Partial<Omit<Toast, 'key'>> = {}): number {
    return add({
      ...error,
      title: error.title || $i18n.t('general.error.title'),
      text: error.text || $i18n.t('general.error.text'),
      actions: error.actions || [],
      timed: error.timed || true,
      type: 'error'
    } as Toast)
  }

  function info (info: Partial<Omit<Toast, 'key'>>): number {
    return add({
      ...info,
      actions: info.actions || [],
      timed: info.timed || true,
      type: 'info'
    } as Toast)
  }

  return {
    toasts,
    remove,
    add,
    success,
    warn,
    error,
    info
  }
})
