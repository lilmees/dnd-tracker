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
    toast.error({ title: t('error.general.title'), text: t('error.general.text') })
    navigateTo('/campaigns')
  } finally {
    isPending.value = false
  }
}
</script>

<template>
  <NuxtLayout>
    <div v-if="isPending" class="loader" />
    <div v-else-if="campaign" class="py-4 space-y-4">
      <Back url="/campaigns" :label="$t('campaign.back')" class="sm:hidden" />
      <div
        class="rounded w-full tracker-shadow relative p-2 flex"
        :style="{ 'background-color': campaign.background || '#000', color: campaign.color || '#fff' }"
      >
        <h1 class="grow text-center">
          {{ campaign.title }}
        </h1>
        <Back
          url="/campaigns"
          :label="$t('campaign.back')"
          class="hidden sm:block absolute right-4 top-1/2 -translate-y-1/2"
          :color="campaign.color || '#fff'"
        />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div class="space-y-8">
          <div class="space-y-4">
            <h2>{{ $t('general.encounters') }}</h2>
            <div v-if="encounters.length" class="flex flex-wrap gap-4">
              <EncounterCard v-for="encounter in encounters" :key="encounter.id" :encounter="encounter" />
            </div>
          </div>
        </div>
        <div class="space-y-8">
          <CampaignPlayers v-model="campaign.players" :id="campaign.id" />
          <CampaignMonsters v-model="campaign['homebrew-monsters']" :id="campaign.id" />
        </div>
      </div>
      <div>notes...</div>
    </div>
  </NuxtLayout>
</template>
