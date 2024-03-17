<script setup lang="ts">
defineProps<{ campaign: Campaign }>()

const route = useRoute()
</script>

<template>
  <div class="flex justify-between w-full gap-2 border-b-2 border-slate-700">
    <div v-if="campaign && campaign.title" class="flex items-end gap-2 mb-1">
      <div
        class="rounded-lg w-10 h-10 border-4 relative"
        :style="{
          'background-color': campaign?.background || '#000',
          color: campaign?.color || '#fff',
          'border-color': campaign?.color || '#000'
        }"
      >
        <h3 class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 uppercase">
          {{ campaign.title.slice(0, 1) }}
        </h3>
      </div>
      <h2 class="mb-1">
        {{ campaign.title }}
      </h2>
    </div>
    <div class="mb-1">
      <RouteLink
        v-if="!route.path.includes('/campaigns/') && campaign?.title"
        :url="campaignUrl(campaign, 'content')"
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
