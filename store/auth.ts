export const useAuthStore = defineStore('useAuthStore', () => {
  const supabase = useSupabaseClient()
  const localePath = useLocalePath()

  async function register (credentails: Login, data: Register): Promise<void> {
    const { error, data: userData } = await supabase.auth.signUp(credentails)

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
    const { error } = Object.values(credentials).length
      ? await supabase.auth.signInWithPassword(credentials)
      : await supabase.auth.signInWithOAuth({ provider: 'google' })

    if (error) {
      throw error
    } else {
      setTimeout(() => navigateTo(localePath('/')), 100)
    }
  }

  async function logout (): Promise<void> {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    } else {
      setTimeout(() => navigateTo(localePath('/')), 100)
    }
  }

  async function forgotPassword (email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email)

    if (error) {
      throw error
    }
  }

  async function updateUser (payload: { password: string }): Promise<void> {
    const { error } = await supabase.auth.updateUser(payload)

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
