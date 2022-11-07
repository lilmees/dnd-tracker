<script setup>
defineProps({ campaign: { type: Object, required: true } })
const route = useRoute()
</script>

<template>
  <div class="flex justify-between w-full gap-2 border-b border-primary">
    <div class="flex items-end gap-2 mb-1">
      <div
        class="rounded w-10 h-10 tracker-shadow relative"
        :style="{ 'background-color': campaign.background, color: campaign.color }"
      >
        <h3 class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 uppercase">
          {{ campaign.title.slice(0, 1) }}
        </h3>
      </div>
      <h2 class="mb-1">{{ campaign.title }}</h2>
    </div>
    <div class="mb-1">
      <NuxtLink
        v-if="!route.path.includes('/campaigns/')"
        :to="`/campaigns/${
          campaign.title.replace(/[\W]/g, '') === '' ? 'encounter' : campaign.title.replace(/[\W]/g, '')
        }-${campaign.id}`"
      >
        <Button :label="$t('campaign.goCampaign')" />
      </NuxtLink>
    </div>
  </div>
</template>
