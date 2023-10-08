import logRocket from 'logrocket'
import { isMember } from '@/utils/permission-helpers'

export const useCurrentCampaignStore = defineStore('useCurrentCampaignStore', () => {
  const supabase = useSupabaseClient()
  const store = useCampaignsStore()
  const homebrew = useHomebrewStore()
  const encounterStore = useEncountersStore()
  const profile = useProfileStore()
  const toast = useToastStore()
  const localePath = useLocalePath()

  const loading = ref<boolean>(true)
  const error = ref<string | null>(null)
  const campaign = ref<Campaign | null>(null)
  const encounters = ref<Encounter[]>([])

  const activeModal = ref<HomebrewModal>()
  const activeHomebrew = ref<Homebrew>()
  const activeIndex = ref<number>()

  async function getCampaignInfo (id: number): Promise<void> {
    loading.value = true
    error.value = null

    try {
      campaign.value = await store.getCampaignById(id)

      if (profile.data && !isMember(campaign.value, profile.data.id)) {
        navigateTo(localePath('/not-member'))
      }

      useHead({ title: campaign.value.title })
      encounters.value = await encounterStore.getEncountersByCampaign(campaign.value.id)
    } catch (err) {
      logRocket.captureException(err as Error)
      error.value = err as string
      toast.error()
      navigateTo(localePath('/campaigns'))
    } finally {
      loading.value = false
    }
  }

  async function addHomebrew (hb: AddHomebrew): Promise<void> {
    try {
      const data = await homebrew.addHomebrew(hb)

      if (campaign?.value?.homebrew_items) {
        campaign.value.homebrew_items = [...campaign.value.homebrew_items, data]
      }
    } catch (err) {
      logRocket.captureException(err as Error)
      toast.error()
    }
  }

  async function updateHomebrew (hb: Homebrew, id: number): Promise<void> {
    try {
      await homebrew.updateHomebrew(hb, id)

      if (campaign?.value?.homebrew_items) {
        const index = campaign.value.homebrew_items.findIndex(e => e.id === id)
        campaign.value.homebrew_items[index] = {
          ...campaign.value.homebrew_items[index],
          ...hb
        }
      }
    } catch (err) {
      logRocket.captureException(err as Error)
      toast.error()
    }
  }

  async function removeHomebrew (id: number): Promise<void> {
    try {
      await homebrew.deleteHomebrew(id)

      if (campaign?.value?.homebrew_items) {
        campaign.value.homebrew_items = campaign.value.homebrew_items.filter(h => h.id !== id)
      }
    } catch (err) {
      logRocket.captureException(err as Error)
      toast.error()
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

  async function addCampaignTeamMember (member: AddTeamMember, id: number): Promise<void> {
    const { data, error } = await supabase
      .from('team')
      .insert([member as never])
      .select('*, user(id, created_at, username, name, avatar, email, badges)')

    if (error) {
      throw error
    }

    await deleteJoinCampaignToken(id)

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

  function resetActiveState (): void {
    activeIndex.value = undefined
    activeHomebrew.value = undefined
    activeModal.value = undefined
  }

  return {
    loading,
    error,
    campaign,
    encounters,
    activeModal,
    activeHomebrew,
    activeIndex,
    getCampaignInfo,
    addHomebrew,
    updateHomebrew,
    removeHomebrew,
    resetActiveState,
    findJoinCampaignToken,
    createJoinCampaignToken,
    deleteJoinCampaignToken,
    addCampaignTeamMember,
    deleteCampaignTeamMember
  }
})
