<script setup lang="ts">
import logRocket from 'logrocket'

const toast = useToastStore()
const store = useCampaignsStore()
const profile = useProfileStore()
const current = useCurrentCampaignStore()
const localePath = useLocalePath()

const needConfirmation = ref<boolean>(false)
const needSelection = ref<boolean>(false)

async function deleteCampaign(): Promise<void> {
  try {
    if (current.campaign && isOwner(current.campaign, profile.data?.id || '')) {
      await store.deleteCampaign(current.campaign.id)
      navigateTo(localePath('/campaigns'))
    }
  }
  catch (err) {
    logRocket.captureException(err as Error)
    toast.error()
  }
  finally {
    needConfirmation.value = false
  }
}

async function transferOwnership(): Promise<void> {
  try {
    if (current.campaign && isOwner(current.campaign, profile.data?.id || '')) {
      await store.deleteCampaign(current.campaign.id)
      navigateTo(localePath('/campaigns'))
    }
  }
  catch (err) {
    logRocket.captureException(err as Error)
    toast.error()
  }
  finally {
    needConfirmation.value = false
  }
}
</script>

<template>
  <section class="space-y-2">
    <div class="flex flex-col items-center w-full gap-y-4 py-6">
      <div class="grow max-w-4xl border-4 border-danger bg-danger/50 rounded-lg">
        <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-x-8 gap-y-4 p-6">
          <div class="space-y-2">
            <h3>
              {{ $t('pages.campaign.danger.transfer.title') }}
            </h3>
            <p>
              {{ $t('pages.campaign.danger.transfer.text') }}
            </p>
          </div>
          <div class="flex justify-end">
            <button
              :aria-label="$t('actions.transfer')"
              :disabled="!current.campaign || !current.campaign?.team?.length || !isOwner(current.campaign, profile.data?.id || '')"
              class="btn-black"
              @click="needSelection = true"
            >
              {{ $t('actions.transfer') }}
            </button>
          </div>
        </div>
        <div class="w-full border-2 border-danger" />
        <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-x-8 gap-y-4 p-6">
          <div class="space-y-2">
            <h3>
              {{ $t('pages.campaign.danger.delete.title') }}
            </h3>
            <p>
              {{ $t('pages.campaign.danger.delete.text') }}
            </p>
          </div>
          <div class="flex justify-end">
            <button
              :aria-label="$t('actions.delete')"
              :disabled="!current.campaign || !isOwner(current.campaign, profile.data?.id || '')"
              class="btn-black"
              @click="needConfirmation = true"
            >
              {{ $t('actions.delete') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <template v-if="current.campaign">
      <ConfirmationModal
        :open="needConfirmation"
        :title="current.campaign.title"
        @close="needConfirmation = false"
        @delete="deleteCampaign"
      />
      <TransferOwnershipModal
        :open="needSelection"
        :campaign="current.campaign"
        @close="needSelection = false"
        @transfered="navigateTo($route.fullPath.replace('danger-zone', 'content'))"
      />
    </template>
  </section>
</template>
