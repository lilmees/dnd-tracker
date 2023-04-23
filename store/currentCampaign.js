
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

  const loading = ref(false)
  const error = ref(null)
  const campaign = ref(null)
  const encounters = ref([])

  async function getCampaignInfo (id) {
    loading.value = true
    error.value = null
    try {
      campaign.value = await store.getCampaignById(id)
      if (!campaign.value.admins.includes(user.value.id)) {
        navigateTo(localePath('/campaigns'))
      }
      useHead({ title: campaign.value.title })
      encounters.value = await encounterStore.getEncountersByCampaign(campaign.value.id)
    } catch (err) {
      error.value = err
      toast.error()
      navigateTo(localePath('/campaigns'))
    } finally {
      loading.value = false
    }
  }

  async function addHomebrew (hb) {
    try {
      const data = await homebrew.addHomebrew(hb)
      campaign.value.homebrew_items = [...campaign.value.homebrew_items, ...data]
    } catch (err) {
      toast.error()
    }
  }

  async function updateHomebrew (hb, id) {
    try {
      await homebrew.updateHomebrew(hb, id)
      const index = campaign.value.homebrew_items.findIndex(e => e.id === id)
      campaign.value.homebrew_items[index] = {
        ...campaign.value.homebrew_items[index],
        ...hb
      }
    } catch (err) {
      toast.error()
    }
  }

  async function removeHomebrew (id) {
    try {
      await homebrew.deleteHomebrew(id)
      campaign.value.homebrew_items = campaign.value.homebrew_items.filter(h => h.id !== id)
    } catch (err) {
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
