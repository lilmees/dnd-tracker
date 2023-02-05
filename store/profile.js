import { defineStore } from 'pinia'

export const useProfileStore = defineStore('useProfileStore', {
  state: () => ({
    loading: false,
    error: null,
    data: null,
  }),
  actions: {
    async fetch() {
      const supabase = useSupabaseClient()
      const user = useSupabaseUser()
      try {
        if (!user.value) return
        this.error = null
        this.loading = true
        const { data, error } = await supabase.from('profiles').select('*').eq('id', user.value.id).single()
        if (error) this.error = error
        if (data) this.data = data
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
  },
})
