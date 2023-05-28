import { defineStore } from 'pinia'

export const useToastStore = defineStore('useToastStore', () => {
  const { $i18n } = useNuxtApp()

  const toasts: Ref<Toast[]> = ref([])
  const sortedToasts: ComputedRef<Toast[]> = computed(() =>
    [...toasts.value].sort((a: Toast, b: Toast) => b.key - a.key)
  )

  function remove (key: number): void {
    toasts.value = toasts.value.filter(obj => obj.key !== key)
  }

  function add (toast: Toast): number {
    const key: number = toasts.value.length
    const timeout: number = toast.timeout || 5000
    const titleExists: boolean = toasts.value
      .findIndex(({ title }) => title === toast.title) > -1

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

  function success (success: ToastSet): number {
    return add({
      ...success,
      actions: success.actions || [],
      timed: success.timed || true,
      type: 'success'
    } as Toast)
  }

  function warn (warn: ToastSet): number {
    return add({
      ...warn,
      actions: warn.actions || [],
      timed: warn.timed || true,
      type: 'warn'
    } as Toast)
  }

  function error (error: ToastSet = {}): number {
    return add({
      ...error,
      title: error.title || $i18n.t('error.general.title'),
      text: error.text || $i18n.t('error.general.text'),
      actions: error.actions || [],
      timed: error.timed || true,
      type: 'error'
    } as Toast)
  }

  function info (info: ToastSet): number {
    return add({
      ...info,
      actions: info.actions || [],
      timed: info.timed || true,
      type: 'info'
    } as Toast)
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
