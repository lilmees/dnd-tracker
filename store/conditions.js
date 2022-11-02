import { defineStore } from 'pinia'

export const useConditionsStore = defineStore('useConditionsStore', {
  state: () => ({
    loading: false,
    error: null,
    data: null,
  }),
  actions: {
    async fetch() {
      const supabase = useSupabaseClient()
      try {
        if (this.data && this.loading) return
        this.loading = true
        this.error = null
        const { data, error } = await supabase.from('conditions').select('*')
        if (error) throw error
        if (data) this.data = data
        this.data = data
      } catch (error) {
        console.error(error)
        this.error = error
      } finally {
        this.loading = false
      }
    },
  },
})
