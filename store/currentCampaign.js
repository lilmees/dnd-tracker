import { defineStore } from 'pinia'
import { useEncountersStore } from '@/store/encounters'
import { useCampaignsStore } from '@/store/campaigns'
import { useToastStore } from '@/store/toast'

export const useCurrentCampaignStore = defineStore('useCurrentCampaignStore', () => {
  const user = useSupabaseUser()
  const store = useCampaignsStore()
  const encounterStore = useEncountersStore()
  const toast = useToastStore()
  const localePath = useLocalePath()
  const { $i18n } = useNuxtApp()

  const loading = ref(false)
  const error = ref(null)
  const campaign = ref(null)
  const encounters = ref([])

  async function getCampaignInfo(id) {
    loading.value = true
    error.value = null
    try {
      campaign.value = await store.getCampaignById(id)
      if (!campaign.value.admins.includes(user.value.id)) navigateTo(localePath('/campaigns'))
      useHead({ title: campaign.value.title })
      encounters.value = await encounterStore.getEncountersByCampaign(campaign.value.id)
    } catch (err) {
      console.log(err)
      error.value = err
      toast.error({ title: $i18n.t('error.general.title'), text: $i18n.t('error.general.text') })
      navigateTo(localePath('/campaigns'))
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    campaign,
    encounters,
    getCampaignInfo,
  }
})
