
import { defineStore } from 'pinia'
import { useEncountersStore } from '@/store/encounters'
import { useCampaignsStore } from '@/store/campaigns'
import { useToastStore } from '@/store/toast'

export const useCurrentCampaignStore = defineStore('useCurrentCampaignStore', () => {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()
  const store = useCampaignsStore()
  const encounterStore = useEncountersStore()
  const toast = useToastStore()
  const localePath = useLocalePath()
  const { $i18n } = useNuxtApp()

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
      toast.error({ title: $i18n.t('error.general.title'), text: $i18n.t('error.general.text') })
      navigateTo(localePath('/campaigns'))
    } finally {
      loading.value = false
    }
  }

  async function addHomebrew (homebrew) {
    try {
      const { data, error: err } = await supabase.from('homebrew_items')
        .insert([homebrew])
        .select('*')
      if (err) {
        throw err
      }
      campaign.value.homebrew_items = [...campaign.value.homebrew_items, ...data]
    } catch (err) {
      toast.error({
        title: $i18n.t('error.general.title'),
        text: $i18n.t('error.general.text')
      })
      navigateTo(localePath('/campaigns'))
    }
  }

  async function updateHomebrew (homebrew, id) {
    try {
      const { error: err } = await supabase.from('homebrew_items')
        .update(homebrew)
        .eq('id', id)
      if (err) {
        throw err
      }
      const index = campaign.value.homebrew_items.findIndex(e => e.id === id)
      campaign.value.homebrew_items[index] = {
        ...campaign.value.homebrew_items[index],
        ...homebrew
      }
    } catch (err) {
      toast.error({
        title: $i18n.t('error.general.title'),
        text: $i18n.t('error.general.text')
      })
    }
  }

  async function removeHomebrew (id) {
    try {
      const { error: err } = await supabase.from('homebrew_items').delete().eq('id', id)
      if (err) {
        throw err
      }
      campaign.value.homebrew_items = campaign.value.homebrew_items.filter(h => h.id !== id)
    } catch (err) {
      toast.error({
        title: $i18n.t('error.general.title'),
        text: $i18n.t('error.general.text')
      })
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
