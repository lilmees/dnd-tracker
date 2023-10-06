<script setup lang="ts">
import { campaignUrl } from '@/utils/url-genarators'

const props = defineProps<{ campaign: Campaign | number }>()

const store = useCampaignsStore()
const route = useRoute()

const cam = ref<Campaign | null>(null)

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
  <div class="flex justify-between w-full gap-2 border-b-2 border-slate-700">
    <div v-if="cam && cam.title" class="flex items-end gap-2 mb-1">
      <div
        class="rounded-lg w-10 h-10 border-4 relative"
        :style="{
          'background-color': cam?.background || '#000',
          color: cam?.color || '#fff',
          'border-color': cam?.color || '#000'
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
      <RouteLink
        v-if="!route.path.includes('/campaigns/') && cam?.title"
        :url="campaignUrl(cam, 'content')"
      >
        <button
          class="btn-primary"
          :aria-label="$t('components.encounterCampaignHeader.go')"
        >
          {{ $t('components.encounterCampaignHeader.go') }}
        </button>
      </RouteLink>
    </div>
  </div>
</template>
