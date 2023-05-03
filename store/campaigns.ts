import { defineStore } from 'pinia'

export const useCampaignsStore = defineStore('useCampaignsStore', () => {
  const supabase = useSupabaseClient()

  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  const campaigns: Ref<Campaign[] | null> = ref(null)
  const currentCampaign: Ref<Campaign | null> = ref(null)
  const currentCampaignEncounters: Ref<Encounter[]> = ref([])

  const sortedCampaigns: ComputedRef<Campaign[] | null> = computed(() => {
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
        .select('*, initiative_sheets(title)')

      if (errorMessage) {
        throw errorMessage
      }
      if (data) {
        campaigns.value = data
      }
    } catch (err) {
      useBugsnag().notify(`Handeld in catch: ${err}`)
      error.value = err as string
    } finally {
      loading.value = false
    }
  }

  async function getCampaignById (id: number): Promise<Campaign> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*, homebrew_items(*), notes(*)')
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

  async function updateCampaign (campaign: CampaignUpdate, id: number): Promise<void> {
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
    updateCampaign
  }
})
