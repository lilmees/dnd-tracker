<script setup lang="ts">
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
    <div v-else-if="!store.error" class="my-10">
      <div class="pt-5 pb-10 flex justify-between items-center">
        <h1 class="grow">
          {{ $t('pages.campaigns.campaigns') }}
        </h1>
        <button
          class="btn-primary tracker-shadow-pulse"
          :aria-label="$t('pages.campaigns.add')"
          @click="isOpen = true"
        >
          {{ $t('pages.campaigns.add') }}
        </button>
        <div />
      </div>
      <div v-if="store.sortedCampaigns.length" class="flex flex-wrap gap-4 items-start">
        <CampaignCard v-for="campaign in store.sortedCampaigns" :key="campaign.id" :campaign="campaign" />
      </div>
      <div v-else class="mx-auto max-w-lg tracker-shadow-pulse p-2 sm:p-10 rounded-lg space-y-4">
        <h2>{{ $t('pages.campaigns.noData.title') }}</h2>
        <p>{{ $t('pages.campaigns.noData.text') }}</p>
        <button
          class="btn-black"
          :aria-label="$t('pages.campaigns.add')"
          @click="isOpen = true"
        >
          {{ $t('pages.campaigns.add') }}
        </button>
      </div>
      <AddCampaignModal :open="isOpen" @close="isOpen = false" />
    </div>
    <div v-else class="max-w-sm mx-auto py-20 space-y-4">
      <h2 class="text-center text-danger">
        {{ $t('general.error.text') }}
      </h2>
      <button
        class="btn-black w-full"
        :aria-label="$t('actions.tryAgain')"
        @click="store.fetch()"
      >
        {{ $t('actions.tryAgain') }}
      </button>
    </div>
  </NuxtLayout>
</template>
