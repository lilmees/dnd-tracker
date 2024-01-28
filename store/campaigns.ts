import logRocket from 'logrocket'
import { sortCampaignsByCreatedAt, sortCreatedAt } from '@/utils/sort'
import { getMax } from '@/utils/subscription-helpers'

export const useCampaignsStore = defineStore('useCampaignsStore', () => {
  const supabase = useSupabaseClient()
  const profile = useProfileStore()

  const loading = ref<boolean>(true)
  const error = ref<string>()
  const campaigns = ref<Campaign[]>()

  const max = computed<number>(() => getMax('campaign', profile.data?.subscription_type || 'free'))

  const allowedCampaigns = computed<Campaign[] | null>(() => {
    if (!profile.data || !campaigns.value) { return null }

    const { userArr, nonUserArr } = sortCampaignsByCreatedAt(campaigns.value, profile.data.id)

    return [...userArr.splice(0, max.value), ...nonUserArr]
  })

  async function fetch (): Promise<void> {
    loading.value = true
    error.value = undefined

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
      fetch()
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
    allowedCampaigns,
    max,
    fetch,
    getCampaignById,
    addCampaign,
    deleteCampaign,
    bulkDeleteCampaigns,
    updateCampaign
  }
})
