export const useProfileStore = defineStore('useProfileStore', () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const auth = useAuthStore()
  const toast = useToastStore()

  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const data = ref<Profile | null>(null)

  const getSocialProfile = computed<SocialProfile | null>(() => {
    if (!data.value) {
      return null
    }
    else {
      const { role, marketing, subscription_type, temp_subscription, ...social } = data.value
      return social as SocialProfile
    }
  })

  async function fetch(): Promise<void> {
    error.value = null

    try {
      if (!user.value) {
        data.value = null
      }
      else if (!loading.value) {
        loading.value = true

        const { data: prof, error: err } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.value.id)
          .single()

        if (err) {
          if (err.details.includes('Results contain 0 rows')) {
            await auth.logout()
          }
          else {
            error.value = err.details
          }
        }
        if (prof) {
          data.value = prof
        }
      }
    }
    catch (err) {
      console.error(err)
      error.value = err as string
    }
    finally {
      loading.value = false
    }
  }

  async function updateProfile(prof: ProfileUpdate): Promise<void> {
    if (!prof.password) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update(prof as never)
        .eq('id', user.value!.id)
        .select('*')

      if (profileError) {
        throw profileError
      }
    }

    if (prof.email || prof.password) {
      const { email, password } = prof
      const { error: userErr } = await supabase.auth.updateUser(removeEmptyKeys({ email, password }))

      if (userErr) {
        throw userErr
      }
    }

    fetch()
  }

  async function deleteProfile(): Promise<void> {
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

  async function getProfileById(id: string): Promise<SocialProfile | undefined> {
    try {
      const { data, error: err } = await supabase
        .from('profiles')
        .select('id, created_at, username, name, avatar, email, badges')
        .eq('id', id)
        .single()

      if (err) {
        throw err
      }

      return data as unknown as SocialProfile
    }
    catch (err) {
      console.error(err)
      toast.error()
    }
  }

  async function getProfileByUsernameFuzzy(username: string): Promise<SocialProfile[] | undefined> {
    try {
      const { data, error: err } = await supabase
        .from('profiles')
        .select('id, created_at, username, name, avatar, email, badges')
        .ilike('username', `%${username}%`)
        .limit(12)

      if (err) {
        throw err
      }

      return data as unknown as SocialProfile[]
    }
    catch (err) {
      console.error(err)
      toast.error()
    }
  }

  return {
    loading,
    error,
    data,
    getSocialProfile,
    fetch,
    updateProfile,
    deleteProfile,
    getProfileById,
    getProfileByUsernameFuzzy,
  }
})
