
import { defineStore } from 'pinia'
import { useEncountersStore } from '@/store/encounters'
import { useCampaignsStore } from '@/store/campaigns'
import { useHomebrewStore } from '@/store/homebrew'
import { useToastStore } from '@/store/toast'

export const useCurrentCampaignStore = defineStore('useCurrentCampaignStore', () => {
  const user = useSupabaseUser()
  const store = useCampaignsStore()
  const homebrew = useHomebrewStore()
  const encounterStore = useEncountersStore()
  const toast = useToastStore()
  const localePath = useLocalePath()

  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  const campaign: Ref<Campaign | null> = ref(null)
  const encounters: Ref<Encounter[]> = ref([])

  async function getCampaignInfo (id: number): Promise<void> {
    loading.value = true
    error.value = null

    try {
      campaign.value = await store.getCampaignById(id)

      if (user.value && !campaign.value.admins.includes(user.value.id)) {
        navigateTo(localePath('/campaigns'))
      }

      useHead({ title: campaign.value.title })
      encounters.value = await encounterStore.getEncountersByCampaign(campaign.value.id)
    } catch (err) {
      useBugsnag().notify(`Handeld in catch: ${useError(err)}`)
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
      useBugsnag().notify(`Handeld in catch: ${useError(err)}`)
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
      useBugsnag().notify(`Handeld in catch: ${useError(err)}`)
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
      useBugsnag().notify(`Handeld in catch: ${useError(err)}`)
      toast.error()
    }
  }

  return {
    loading,
    error,
    campaign,
    encounters,
    getCampaignInfo,
    addHomebrew,
    updateHomebrew,
    removeHomebrew
  }
})
