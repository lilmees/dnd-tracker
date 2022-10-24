import { defineStore } from 'pinia'
import { useRuntimeConfig, useSupabaseClient } from '#imports'

export const useAuthStore = defineStore('useAuthStore', {
  actions: {
    async register(credentails, data) {
      const supabase = useSupabaseClient()
      const {
        data: { user },
        error,
      } = await supabase.auth.signUp(credentails)
      if (error) throw error
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ ...data, email: credentails.email, id: user.id }])
      if (profileError) throw profileError
    },
    async login(credentails) {
      const config = useRuntimeConfig()
      const supabase = useSupabaseClient()
      const { error } = await supabase.auth.signInWithPassword(credentails, {
        redirectTo: config.supabaseRedirectUrl,
      })
      if (error) throw error
    },
    async logout() {
      const supabase = useSupabaseClient()
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
    async forgotPassword(email) {
      const supabase = useSupabaseClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
    },
    async updateUser(payload) {
      const supabase = useSupabaseClient()
      const { error } = await supabase.auth.updateUser(payload)
      if (error) throw error
    },
  },
})
