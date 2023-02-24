import { defineStore } from 'pinia'
import { useAuthStore } from '@/store/auth'

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
      const auth = useAuthStore()
      try {
        if (!user.value) this.data = null
        else {
          this.error = null
          this.loading = true
          const { data, error } = await supabase.from('profiles').select('*').eq('id', user.value.id).single()
          if (error) {
            if (error.details.includes('Results contain 0 rows')) await auth.logout()
            else this.error = error
          }
          if (data) this.data = data
        }
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async updateProfile(credentials, data) {
      const supabase = useSupabaseAuthClient()
      const user = useSupabaseUser()
      const { auth } = useSupabaseClient()
      const { error } = await auth.updateUser(credentials)
      if (error) throw error
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ ...data, email: credentials.email })
        .eq('id', user.value.id)
        .select('*')
      if (profileError) throw profileError
      else this.fetch()
    },
    async deleteProfile() {
      const user = useSupabaseUser()
      const supabase = useSupabaseClient()
      const auth = useAuthStore()
      const id = user.value.id
      // logout user
      await auth.logout()
      // delete user profile and data with cascade delete
      const { error } = await supabase.from('profiles').delete().eq('id', id)
      if (error) throw error
      // delete user auth profile
      const { data, error: fetchError } = await useFetch('/api/user/remove', { method: 'POST', body: { id } })
      if (data.value?.error) throw data.value.error
      if (fetchError.value) throw fetchError.value
      this.data = null
    },
  },
})
