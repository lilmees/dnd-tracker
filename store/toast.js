import { defineStore } from 'pinia'

export const useToastStore = defineStore('useToastStore', {
  state: () => ({
    toasts: [],
  }),
  getters: {
    sortedToasts: state => [...state.toasts].sort((a, b) => b.key - a.key),
  },
  actions: {
    remove(key) {
      this.toasts = this.toasts.filter(obj => obj.key !== key)
    },
    add(toast) {
      const key = this.toasts.length
      const timeout = toast.timeout || 5000
      const titleExists = this.toasts.findIndex(({ title }) => title === toast.title) > -1

      if (!titleExists) this.toasts = [...this.toasts, { ...toast, key }]

      if (timeout > 0 && toast.timed) {
        setTimeout(() => {
          this.toasts = this.toasts.filter(obj => obj.key !== key)
        }, timeout)
      }
      return key
    },
    success({ title, text, icon, timeout, actions = [], timed = true }) {
      return this.add({ title, text, icon, actions, timeout, timed, type: 'success' })
    },
    warn({ title, text, icon, timeout, actions = [], timed = true }) {
      return this.add({ title, text, icon, actions, timeout, timed, type: 'warn' })
    },
    error({ title, text, icon, timeout, actions = [], timed = true }) {
      return this.add({ title, text, icon, actions, timeout, timed, type: 'error' })
    },
    info({ title, text, icon, timeout, actions = [], timed = true }) {
      return this.add({ title, text, icon, actions, timeout, timed, type: 'info' })
    },
  },
})
