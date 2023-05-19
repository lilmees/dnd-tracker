<script setup lang="ts">
import { useToastStore } from '@/store/toast'
import { useCampaignsStore } from '@/store/campaigns'

definePageMeta({ middleware: ['auth'] })
useHead({ title: 'Campaigns' })

const toast = useToastStore()
const store = useCampaignsStore()

const isOpen: Ref<boolean> = ref(false)

onMounted(() => store.fetch())

watch(() => store.error, (v) => {
  if (v) {
    toast.error()
  }
})
</script>

<template>
  <NuxtLayout>
    <div v-if="store.loading || !store.sortedCampaigns" class="loader" />
    <div v-else-if="!store.error">
      <div class="py-5 flex justify-between items-center">
        <h1>{{ $t('campaigns.campaigns') }}</h1>
        <div>
          <Button
            :label="$t('campaigns.add')"
            class="tracker-shadow-pulse"
            @click="isOpen = true"
          />
        </div>
      </div>
      <div v-if="store.sortedCampaigns.length" class="flex flex-wrap gap-4 items-start">
        <CampaignCard v-for="campaign in store.sortedCampaigns" :key="campaign.id" :campaign="campaign" />
      </div>
      <div v-else class="mx-auto max-w-lg tracker-shadow-pulse p-2 sm:p-10 rounded-xl space-y-4">
        <h2>{{ $t('campaigns.noData.title') }}</h2>
        <p>{{ $t('campaigns.noData.text') }}</p>
        <Button :label="$t('campaigns.add')" @click="isOpen = true" />
      </div>
      <AddCampaignModal :open="isOpen" @close="isOpen = false" />
    </div>
    <div v-else class="max-w-sm mx-auto py-20 space-y-4">
      <h2 class="text-center text-danger">
        {{ $t('error.general.text') }}
      </h2>
      <Button :label="$t('actions.tryAgain')" inline @click="store.fetch()" />
    </div>
  </NuxtLayout>
</template>
