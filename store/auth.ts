import { defineStore } from 'pinia'

export const useAuthStore = defineStore('useAuthStore', () => {
  const supabase = useSupabaseAuthClient()
  const { auth } = useSupabaseClient()
  const localePath = useLocalePath()

  async function register (credentails: Login, data: Register): Promise<void> {
    const { error, data: userData } = await auth.signUp(credentails)

    if (error) {
      throw error
    }

    if (userData?.user) {
      const profile: Profile = {
        ...data,
        email: credentails.email,
        id: userData.user.id,
        role: 'User',
        paid_subscription_active: false,
        subscription_type: 'free'
      }

      const { error } = await supabase.from('profiles').insert([profile as never])

      if (error?.message.includes('duplicate key')) {
        throw new Error('Email already in use')
      } else if (error) {
        throw error
      }
    }
  }

  async function login (credentials: Login): Promise<void> {
    const { error } = await auth.signInWithPassword(credentials)

    if (error) {
      throw error
    } else {
      setTimeout(() => navigateTo(localePath('/')), 100)
    }
  }

  async function logout (): Promise<void> {
    const { error } = await auth.signOut()

    if (error) {
      throw error
    } else {
      setTimeout(() => navigateTo(localePath('/')), 100)
    }
  }

  async function forgotPassword (email: string): Promise<void> {
    const { error } = await auth.resetPasswordForEmail(email)

    if (error) {
      throw error
    }
  }

  async function updateUser (payload: Profile): Promise<void> {
    const { error } = await auth.updateUser(payload)

    if (error) {
      throw error
    }
  }

  return {
    register,
    login,
    logout,
    forgotPassword,
    updateUser
  }
})
