import { defineStore } from 'pinia'
import { useSupabaseClient } from '#imports'

export const useAuthStore = defineStore('useAuthStore', {
  actions: {
    async register(credentails, data) {
      const supabase = useSupabaseClient()
      const { error, user } = await supabase.auth.signUp(credentails)
      if (error) throw error
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ ...data, email: credentails.email, id: user.id }])
      if (profileError?.message.includes('duplicate key')) throw new Error('Email already in use')
      else if (profileError) throw profileError
    },
    async login(credentials) {
      const { auth } = useSupabaseClient()
      const { error } = await auth.signIn(credentials)
      if (error) throw error
      else setTimeout(() => navigateTo('/'), 100)
    },
    async logout() {
      const { auth } = useSupabaseClient()
      const { error } = await auth.signOut()
      if (error) throw error
      else setTimeout(() => navigateTo('/'), 100)
    },
    async forgotPassword(email) {
      const { auth } = useSupabaseClient()
      const { error } = await auth.resetPasswordForEmail(email)
      if (error) throw error
    },
    async updateUser(payload) {
      const { auth } = useSupabaseClient()
      const { error } = await auth.updateUser(payload)
      if (error) throw error
    },
  },
})
