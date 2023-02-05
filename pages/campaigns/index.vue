<script setup>
import { useToastStore } from '@/store/toast'
import { useCampaignsStore } from '@/store/campaigns'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'

definePageMeta({ middleware: ['auth'] })
useHead({ title: 'Campaigns' })

const toast = useToastStore()
const store = useCampaignsStore()
const { t } = useI18n({ useScope: 'global' })
const isOpen = ref(false)
const { error } = storeToRefs(store)

onMounted(() => store.fetch())

watch(error, v => {
  if (!v) return
  toast.error({ title: t('error.general.title'), text: t('error.general.text') })
})
</script>

<template>
  <NuxtLayout>
    <div v-if="store.loading || !store.sortedCampaigns" class="loader" />
    <div v-else-if="!store.error">
      <div class="py-5 flex justify-between items-center">
        <h1>{{ $t('campaigns.campaigns') }}</h1>
        <div class="tracker-shadow-pulse">
          <Button :label="$t('campaigns.add')" @click="isOpen = true" />
        </div>
      </div>
      <div v-if="store.sortedCampaigns.length" class="flex flex-wrap gap-4">
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
      <h2 class="text-center text-danger">{{ $t('error.general.text') }}</h2>
      <Button :label="$t('actions.tryAgain')" inline @click="store.fetch()" />
    </div>
  </NuxtLayout>
</template>
