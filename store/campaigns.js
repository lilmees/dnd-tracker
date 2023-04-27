import { defineStore } from 'pinia'
import { useEncountersStore } from '@/store/encounters'

export const useCampaignsStore = defineStore('useCampaignsStore', () => {
  const supabase = useSupabaseClient()
  const encounters = useEncountersStore()

  const loading = ref(false)
  const error = ref(null)
  const campaigns = ref(null)
  const currentCampaign = ref(null)
  const currentCampaignEncounters = ref([])
  const lastFetched = ref(null)

  const sortedCampaigns = computed(() => {
    return campaigns.value
      ? campaigns.value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      : null
  })

  async function fetch () {
    try {
      // check if there is data that is older then 1 minutes old otherwise refetch the data
      if ((!useMinutesAgo(1, lastFetched.value) && campaigns.value) || loading.value) {
        return
      } else {
        lastFetched.value = Date.now()
      }

      loading.value = true
      error.value = null
      const { data, error: errorMessage } = await supabase.from('campaigns').select('*, initiative_sheets(title)')
      if (errorMessage) {
        throw errorMessage
      }
      if (data) {
        campaigns.value = data
      }
    } catch (err) {
      useBugsnag().notify(`Handeld in catch: ${err}`)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function getCampaignById (id) {
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

  async function addCampaign (campaign) {
    const { data, error } = await supabase.from('campaigns').insert([campaign]).select('*')
    if (error) {
      throw error
    } else {
      campaigns.value.push(data[0])
    }
  }

  async function deleteCampaign (id) {
    // delete encounters first
    await encounters.deleteEncounterByCampaign(id)
    const { data, error } = await supabase.from('campaigns').delete().eq('id', id).select('*')
    if (error) {
      throw error
    } else {
      // check if the data is older than 1 minutes if so filter the campaigns otherwise fetch data
      !useMinutesAgo(1, lastFetched.value)
        ? (campaigns.value = campaigns.value.filter(d => d.id !== id))
        : fetch()
      return data
    }
  }

  async function updateCampaign (campaign, id) {
    const { data, error } = await supabase.from('campaigns').update(campaign).eq('id', id).select('*')
    if (error) {
      throw error
    } else {
      const index = campaigns.value.findIndex(e => e.id === id)
      const oldData = campaigns.value.splice(index, 1)
      campaigns.value.push({ ...oldData[0], ...data[0] })
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
