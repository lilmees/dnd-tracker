export const useCampaignsStore = defineStore('useCampaignsStore', () => {
  const supabase = useSupabaseClient()
  const profile = useProfileStore()
  const toast = useToastStore()

  const loading = ref<boolean>(true)
  const error = ref<string>()
  const campaigns = ref<Campaign[]>()

  const max = computed<number>(() => getMax('campaign', profile.data?.subscription_type || 'free'))

  const allowedCampaigns = computed<Campaign[] | null>(() => {
    if (!profile.data || !campaigns.value) {
      return null
    }

    const { userArr, nonUserArr } = sortCampaignsByCreatedAt(campaigns.value, profile.data.id)

    return [...userArr.splice(0, max.value), ...nonUserArr]
  })

  async function fetch(): Promise<void> {
    loading.value = true
    error.value = undefined

    try {
      const { data } = await sbQuery<Campaign>({
        table: 'campaigns',
        select: `
          *, 
          initiative_sheets(title), 
          created_by(id, created_at, username, name, avatar, email, badges), 
          homebrew_items(id),
          team(id, user(id))
        `,
      })

      if (data) {
        campaigns.value = data
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

  async function getCampaignById(id: number): Promise<Campaign> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*, created_by(id, created_at, username, name, avatar, email, badges), team(id, role, user(id, created_at, username, name, avatar, email, badges)), join_campaign(id, role, user(id, created_at, username, name, avatar, email, badges))')
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }
    else {
      return data
    }
  }

  async function addCampaign(campaign: AddCampaign): Promise<void> {
    const { error } = await supabase
      .from('campaigns')
      .insert([campaign as never])

    if (error) {
      throw error
    }
    else {
      fetch()
    }
  }

  async function deleteCampaign(id: number | number[]): Promise<void> {
    try {
      let query = supabase.from('campaigns').delete()

      query = Array.isArray(id)
        ? query.in('id', id)
        : query.eq('id', id)

      const { error: err } = await query

      if (err) {
        throw err
      }
      else {
        fetch()
      }
    }
    catch (err) {
      console.error(err)
      toast.error()
    }
  }

  async function updateCampaign(campaign: UpdateCampaign, id: number): Promise<void> {
    const { error } = await supabase
      .from('campaigns')
      .update(campaign as never)
      .eq('id', id)

    if (error) {
      throw error
    }
    else {
      fetch()
    }
  }

  return {
    loading,
    error,
    campaigns,
    allowedCampaigns,
    max,
    fetch,
    getCampaignById,
    addCampaign,
    deleteCampaign,
    updateCampaign,
  }
})
