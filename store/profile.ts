import { defineStore } from 'pinia'
import { useAuthStore } from '@/store/auth'

export const useProfileStore = defineStore('useProfileStore', () => {
  const supabaseAuth = useSupabaseAuthClient()
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const auth = useAuthStore()

  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  const data: Ref<Profile | null> = ref(null)

  async function fetch (): Promise<void> {
    error.value = null
    loading.value = true

    try {
      if (!user.value) {
        data.value = null
      } else {
        const { data: prof, error: err } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.value.id)
          .single()

        if (err) {
          if (err.details.includes('Results contain 0 rows')) {
            await auth.logout()
          } else {
            error.value = err.details
          }
        }
        if (prof) {
          data.value = prof
        }
      }
    } catch (err) {
      useBugsnag().notify(`Handeld in catch: ${err}`)
      error.value = err as string
    } finally {
      loading.value = false
    }
  }

  async function updateProfile (prof: Profile): Promise<void> {
    const { error: err } = await supabase
      .from('profiles')
      .update(prof as never)
      .eq('id', user.value!.id)
      .select('*')

    if (err) {
      throw err
    } else {
      fetch()
    }
  }

  async function updateCredentialsProfile (credentials: Login, prof: Profile): Promise<void> {
    const { error: err } = await supabase.auth.updateUser(credentials)

    if (err) {
      throw err
    }

    const { error: profileError } = await supabaseAuth
      .from('profiles')
      .update({ ...prof, email: credentials.email } as never)
      .eq('id', user.value!.id)
      .select('*')

    if (profileError) {
      throw profileError
    } else {
      fetch()
    }
  }

  async function deleteProfile (): Promise<void> {
    const id = user.value!.id
    // logout user
    await auth.logout()
    // delete user profile and data with cascade delete
    const { error: err } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)

    if (err) {
      throw err
    }
    // delete user auth profile
    const { data: prof, error: fetchError } = await useFetch('/api/user/remove', { method: 'POST', body: { id } })

    if (prof.value?.error) {
      throw prof.value.error
    }
    if (fetchError.value) {
      throw fetchError.value
    }

    data.value = null
  }

  return {
    loading,
    error,
    data,
    fetch,
    updateProfile,
    updateCredentialsProfile,
    deleteProfile
  }
})
