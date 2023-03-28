<script setup>
import { useCampaignsStore } from '@/store/campaigns'

const props = defineProps({ campaign: { type: [Object, Number], required: true } })

const store = useCampaignsStore()
const route = useRoute()
const localePath = useLocalePath()

const fetchedCampaign = ref()
const chosenCampaign = computed(() => fetchedCampaign.value || props.campaign)

// if there is only the id of the campaign then fetch the information
watch(
  () => props.campaign,
  async v => {
    if (v && typeof v !== 'object') fetchedCampaign.value = await store.getCampaignById(v)
    else if (v && typeof v === 'object') fetchedCampaign.value = null
  }
)
</script>

<template>
  <div class="flex justify-between w-full gap-2 border-b border-primary">
    <div v-if="chosenCampaign && chosenCampaign.title" class="flex items-end gap-2 mb-1">
      <div
        class="rounded w-10 h-10 tracker-shadow relative"
        :style="{ 'background-color': chosenCampaign?.background || '#000', color: chosenCampaign?.color || '#fff' }"
      >
        <h3 class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 uppercase">
          {{ chosenCampaign.title.slice(0, 1) }}
        </h3>
      </div>
      <h2 class="mb-1">{{ chosenCampaign.title }}</h2>
    </div>
    <div class="mb-1">
      <NuxtLink
        v-if="!route.path.includes('/campaigns/') && chosenCampaign.title"
        :to="
          localePath(
            `/campaigns/${chosenCampaign.id}-${
              chosenCampaign.title.replace(/[\W]/g, '') === '' ? 'encounter' : chosenCampaign.title.replace(/[\W]/g, '')
            }`
          )
        "
      >
        <Button :label="$t('campaign.goCampaign')" />
      </NuxtLink>
    </div>
  </div>
</template>
