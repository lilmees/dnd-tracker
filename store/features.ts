import logRocket from 'logrocket'

export const useFeaturesStore = defineStore('useFeaturesStore', () => {
  const supabase = useSupabaseClient()
  const profile = useProfileStore()

  const loading = ref<boolean>(true)
  const error = ref<string>()
  const data = ref<FeatureRequest[]>()
  const sortBy = ref<FeaturesSortBy>('first_new')
  const createdBy = ref<FeaturesType>('all')
  const search = ref<string>()

  const activeFilters = computed<boolean>(() => !!search.value || createdBy.value !== 'all')

  const sortedFeatures = computed<FeatureRequest[]>(() => {
    if (data.value) {
      let features = data.value

      if (search.value) {
        features = features.filter((f) => {
          return f.title.toLowerCase().includes(search.value?.toLowerCase().trim() || '')
        })
      }

      if (createdBy.value === 'my' && profile.data) {
        features = features.filter(f => f.created_by.id === profile.data!.id)
      }

      switch (sortBy.value) {
        case 'first_new':
          return features.sort((a, b) => b.created_at.localeCompare(a.created_at))
        case 'first_old':
          return features.sort((a, b) => a.created_at.localeCompare(b.created_at))
        case 'voted_most':
          return features.sort((a, b) => {
            const aTotal = a.voted.like.length + a.voted.dislike.length
            const bTotal = b.voted.like.length + b.voted.dislike.length
            return bTotal - aTotal
          })
        case 'voted_least':
          return features.sort((a, b) => {
            const aTotal = a.voted.like.length + a.voted.dislike.length
            const bTotal = b.voted.like.length + b.voted.dislike.length
            return aTotal - bTotal
          })
      }
    } else {
      return []
    }
  })

  async function fetch (): Promise<void> {
    loading.value = true
    error.value = undefined

    try {
      const { data: results, error: err } = await supabase
        .from('features')
        .select('*, created_by(id, created_at, username, name, avatar, email, badges)')

      if (err) {
        throw err
      }

      data.value = results as FeatureRequest[]
    } catch (err) {
      logRocket.captureException(err as Error)
      error.value = err as string
    } finally {
      loading.value = false
    }
  }

  async function addFeature (feature: NewFeatureRequest): Promise<undefined|FeatureRequest> {
    const { data: results, error } = await supabase
      .from('features')
      .insert([feature as never])
      .select('*, created_by(id, created_at, username, name, avatar, email, badges)')

    if (error) {
      throw error
    }

    if (results) {
      data.value
        ? data.value.push(results[0])
        : data.value = [results[0]]

      return results[0] as FeatureRequest
    }
  }

  async function vote (id: string, votes: FeatureRequestVotes): Promise<void> {
    const { data: results, error } = await supabase
      .from('features')
      .update({ voted: votes } as never)
      .eq('id', id)
      .select('*, created_by(id, created_at, username, name, avatar, email, badges)')

    if (error) {
      throw error
    }

    if (results?.length) {
      const index = data.value?.findIndex(f => f.id === (results[0] as FeatureRequest).id)

      if (index !== undefined && data.value) {
        data.value[index] = results[0]
      }
    }
  }

  onMounted(() => fetch())

  return {
    loading,
    error,
    data,
    sortBy,
    sortedFeatures,
    search,
    createdBy,
    activeFilters,
    vote,
    addFeature
  }
})
