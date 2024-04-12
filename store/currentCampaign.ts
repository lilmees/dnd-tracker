import logRocket from 'logrocket'

export const useCurrentCampaignStore = defineStore('useCurrentCampaignStore', () => {
  const supabase = useSupabaseClient()
  const campaignStore = useCampaignsStore()
  const profile = useProfileStore()
  const toast = useToastStore()
  const localePath = useLocalePath()

  const loading = ref<boolean>(true)
  const error = ref<string | null>(null)
  const campaign = ref<Campaign | null>(null)

  const activeModal = ref<HomebrewModal>()
  const activeHomebrew = ref<Homebrew>()
  const activeIndex = ref<number>()

  const max = computed<number>(() => getMax('team', profile.data?.subscription_type || 'free'))

  async function getCampaignInfo (id: number): Promise<void> {
    loading.value = true
    error.value = null

    try {
      campaign.value = await campaignStore.getCampaignById(id)

      if (profile.data && !isMember(campaign.value, profile.data.id)) {
        navigateTo(localePath('/no-member'))
      }

      useHead({ title: campaign.value.title })
    } catch (err) {
      logRocket.captureException(err as Error)
      error.value = err as string
      toast.error()
      navigateTo(localePath('/campaigns'))
    } finally {
      loading.value = false
    }
  }

  async function findJoinCampaignToken (token: string): Promise<CheckJoinCampaign|undefined> {
    const { data, error } = await supabase
      .from('join_campaign')
      .select('*, user(id, created_at, username, name, avatar, email, badges), campaign(title, id)')
      .eq('token', token)

    if (error) {
      throw error
    }
    if (data.length) {
      return data[0]
    }
  }

  async function createJoinCampaignToken (join: CreateJoinCampaign): Promise<void> {
    const { data, error } = await supabase
      .from('join_campaign')
      .insert([join as never])
      .select('*, user(id, created_at, username, name, avatar, email, badges)')

    if (error) {
      throw error
    }
    if (data && campaign.value) {
      campaign.value.join_campaign?.push(data[0] as JoinCampaign)
    }
  }

  async function deleteJoinCampaignToken (id: number): Promise<void> {
    const { error } = await supabase
      .from('join_campaign')
      .delete()
      .eq('id', id)
      .select('*')

    if (error) {
      throw error
    }

    if (campaign.value?.join_campaign) {
      campaign.value.join_campaign = campaign.value.join_campaign.filter(h => h.id !== id)
    }
  }

  async function addCampaignTeamMember (member: AddTeamMember, id?: number): Promise<void> {
    const { data, error } = await supabase
      .from('team')
      .insert([member as never])
      .select('*, user(id, created_at, username, name, avatar, email, badges)')

    if (error) {
      throw error
    }

    if (id) {
      await deleteJoinCampaignToken(id)
    }

    if (data && campaign.value) {
      campaign.value.team?.push(data[0] as TeamMember)
    }
  }

  async function deleteCampaignTeamMember (id: number): Promise<void> {
    const { error } = await supabase
      .from('team')
      .delete()
      .eq('id', id)
      .select('*')

    if (error) {
      throw error
    }

    if (campaign.value?.team) {
      campaign.value.team = campaign.value.team.filter(h => h.id !== id)
    }
  }

  async function updateCampaignTeamMember (member: UpdateTeamMember, id: number): Promise<void> {
    const { error } = await supabase
      .from('team')
      .update(member as never)
      .eq('id', id)

    if (error) {
      throw error
    }

    if (campaign.value?.team) {
      const index = campaign.value.team.findIndex(e => e.id === id)

      campaign.value.team[index] = {
        ...campaign.value.team[index],
        ...member
      }
    }
  }

  function resetActiveState (): void {
    activeIndex.value = undefined
    activeHomebrew.value = undefined
    activeModal.value = undefined
  }

  return {
    loading,
    error,
    campaign,
    activeModal,
    activeHomebrew,
    activeIndex,
    max,
    getCampaignInfo,
    resetActiveState,
    findJoinCampaignToken,
    createJoinCampaignToken,
    deleteJoinCampaignToken,
    addCampaignTeamMember,
    deleteCampaignTeamMember,
    updateCampaignTeamMember
  }
})
