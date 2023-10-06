import logRocket from 'logrocket'

export const useCampaignsStore = defineStore('useCampaignsStore', () => {
  const supabase = useSupabaseClient()

  const loading = ref<boolean>(true)
  const error = ref<string | null>(null)
  const campaigns = ref<Campaign[] | null>(null)
  const currentCampaign = ref<Campaign | null>(null)
  const currentCampaignEncounters = ref<Encounter[]>([])

  const sortedCampaigns = computed<Campaign[] | null>(() => {
    return campaigns.value
      ? campaigns.value
        .sort((a, b) => new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf())
      : null
  })

  async function fetch (): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const { data, error: errorMessage } = await supabase
        .from('campaigns')
        .select('*, initiative_sheets(title), created_by(id, created_at, username, name, avatar, email, badges), homebrew_items(id), team(id)')

      if (errorMessage) {
        throw errorMessage
      }
      if (data) {
        campaigns.value = data
      }
    } catch (err) {
      logRocket.captureException(err as Error)
      error.value = err as string
    } finally {
      loading.value = false
    }
  }

  async function getCampaignById (id: number): Promise<Campaign> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*, created_by(id, created_at, username, name, avatar, email, badges), homebrew_items(*), notes(*), team(id, role, user(id, created_at, username, name, avatar, email, badges)), join_campaign(id, role, user(id, created_at, username, name, avatar, email, badges))')
      .eq('id', id)
      .single()

    if (error) {
      throw error
    } else {
      return data
    }
  }

  async function addCampaign (campaign: AddCampaign): Promise<void> {
    const { data, error } = await supabase
      .from('campaigns')
      .insert([campaign as never])
      .select('*')

    if (error) {
      throw error
    }
    if (data) {
      campaigns.value
        ? campaigns.value.push(data[0])
        : campaigns.value = [data[0]]
    }
  }

  async function deleteCampaign (id: number): Promise<void> {
    const { data, error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id)
      .select('*')

    if (error) {
      throw error
    }
    if (data) {
      fetch()
    }
  }

  async function bulkDeleteCampaigns (ids: number[]): Promise<void> {
    const { data, error } = await supabase
      .from('campaigns')
      .delete()
      .in('id', ids)
      .select('*')

    if (error) {
      throw error
    }
    if (data) {
      fetch()
    }
  }

  async function updateCampaign (campaign: UpdateCampaign, id: number): Promise<void> {
    const { data, error } = await supabase
      .from('campaigns')
      .update(campaign as never)
      .eq('id', id)
      .select('*')

    if (error) {
      throw error
    }
    if (data.length && campaigns.value) {
      const index = campaigns.value.findIndex(e => e.id === id)
      const oldData = campaigns.value.splice(index, 1)
      campaigns.value.push({ ...oldData[0], ...data[0] as object })
    }
  }

  return {
    loading,
    error,
    campaigns,
    sortedCampaigns,
    currentCampaign,
    currentCampaignEncounters,
    fetch,
    getCampaignById,
    addCampaign,
    deleteCampaign,
    bulkDeleteCampaigns,
    updateCampaign
  }
})
