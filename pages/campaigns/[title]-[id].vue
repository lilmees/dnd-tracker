<script setup>
import { useCampaignsStore } from '@/store/campaigns'
import { useEncountersStore } from '@/store/encounters'
import { useToastStore } from '@/store/toast'
import { useI18n } from 'vue-i18n'

definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const toast = useToastStore()
const store = useCampaignsStore()
const encountersStore = useEncountersStore()
const user = useSupabaseUser()
const { t } = useI18n({ useScope: 'global' })
const campaign = ref()
const encounters = ref([])
const isPending = ref(true)

onMounted(() => getCampaignInfo())

async function getCampaignInfo() {
  try {
    campaign.value = await store.getCampaignById(route.params.id)
    if (!campaign.value.admins.includes(user.value.id)) navigateTo('/campaigns')
    useHead({ title: campaign.value.title })
    encounters.value = await encountersStore.getEncountersByCampaign(campaign.value.id)
  } catch (err) {
    toast.error({
      title: t('error.general.title'),
      text: t('error.general.text'),
    })
  } finally {
    isPending.value = false
  }
}
</script>

<template>
  <NuxtLayout>
    <div v-if="isPending" class="loader" />
    <div v-else class="py-4 space-y-4">
      <Back url="/campaigns" :label="$t('campaign.back')" class="container-max" />
      <CampaignHeader :campaign="campaign" />
      <div v-if="encounters.length" class="flex flex-wrap gap-4">
        <EncounterCard v-for="encounter in encounters" :key="encounter.id" :encounter="encounter" />
      </div>
    </div>
  </NuxtLayout>
</template>