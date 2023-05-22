<script setup lang="ts">
import { useCampaignsStore } from '@/store/campaigns'

const props = defineProps<{ campaign: Campaign | number }>()

const store = useCampaignsStore()
const route = useRoute()
const localePath = useLocalePath()

const cam: Ref<Campaign | null> = ref(null)

// if there is only the id of the campaign then fetch the information
if (props.campaign) {
  if (typeof props.campaign !== 'object') {
    cam.value = await store.getCampaignById(props.campaign)
  } else {
    cam.value = props.campaign as Campaign
  }
}

</script>

<template>
  <div class="flex justify-between w-full gap-2 border-b border-primary">
    <div v-if="cam && cam.title" class="flex items-end gap-2 mb-1">
      <div
        class="rounded w-10 h-10 tracker-shadow relative"
        :style="{
          'background-color': cam?.background || '#000',
          color: cam?.color || '#fff'
        }"
      >
        <h3 class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 uppercase">
          {{ cam.title.slice(0, 1) }}
        </h3>
      </div>
      <h2 class="mb-1">
        {{ cam.title }}
      </h2>
    </div>
    <div class="mb-1">
      <NuxtLink
        v-if="!route.path.includes('/campaigns/') && cam?.title"
        :to="
          localePath(
            `/campaigns/${cam.id}-${
              cam.title.replace(/[\W]/g, '') === ''
                ? 'encounter'
                : cam.title.replace(/[\W]/g, '')
            }`
          )
        "
      >
        <button
          class="btn-primary"
          :aria-label="$t('campaign.goCampaign')"
        >
          {{ $t('campaign.goCampaign') }}
        </button>
      </NuxtLink>
    </div>
  </div>
</template>
