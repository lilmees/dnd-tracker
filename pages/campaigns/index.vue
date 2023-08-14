<script setup lang="ts">
import logRocket from 'logrocket'

definePageMeta({ middleware: ['auth'] })
useHead({ title: 'Campaigns' })

const toast = useToastStore()
const store = useCampaignsStore()

const isOpen = ref<boolean>(false)
const isBulk = ref<boolean>(false)
const isUpdating = ref<boolean>(false)
const needConfirmation = ref<boolean>(false)
const selectedCampaigns = ref<Campaign[]>([])

onMounted(() => store.fetch())

whenever(() => store.error, () => { toast.error() })

function toggleSelection (campaign: Campaign): void {
  const index: number = selectedCampaigns.value.findIndex(c => c.id === campaign.id)
  if (index === -1) {
    selectedCampaigns.value.push(campaign)
  } else {
    selectedCampaigns.value.splice(index, 1)
  }
}

async function deleteCampaigns (): Promise<void> {
  try {
    if (selectedCampaigns.value.length === 1) {
      await store.deleteCampaign(selectedCampaigns.value[0].id)
    } else if (selectedCampaigns.value.length > 1) {
      await store.bulkDeleteCampaigns(selectedCampaigns.value.map(v => v.id))
    }
  } catch (err) {
    logRocket.captureException(err as Error)
    toast.error()
  } finally {
    reset()
  }
}

function reset (): void {
  needConfirmation.value = false
  isBulk.value = false
  isUpdating.value = false
  selectedCampaigns.value = []
}
</script>

<template>
  <NuxtLayout>
    <div v-if="!store.error">
      <div class="pt-5 pb-10 flex justify-between items-center">
        <h1 class="grow">
          {{ $t('pages.campaigns.campaigns') }}
        </h1>
        <div class="flex gap-2">
          <button
            class="btn-primary tracker-shadow-pulse"
            :aria-label="$t('pages.campaigns.add')"
            :disabled="store.loading"
            @click="isOpen = true"
          >
            {{ $t('pages.campaigns.add') }}
          </button>
          <tippy interactive :z-index="2" placement="left">
            <button
              class="bg-secondary/50 border-4 border-secondary rounded-lg w-12 h-12"
              :aria-label="$t('general.options')"
              :disabled="store.loading"
            >
              <Icon name="tabler:dots" class="h-6 w-6" />
            </button>
            <template #content>
              <div class="p-4 space-y-2 overflow-auto">
                <button
                  class="flex gap-2 items-center max-w-max"
                  :aria-label="$t('actions.bulkRemove')"
                  @click="isBulk = true"
                >
                  <Icon name="material-symbols:delete-outline-rounded" class="h-4 w-4" />
                  <p>{{ $t('actions.bulkRemove') }}</p>
                </button>
              </div>
            </template>
          </tippy>
        </div>
        <div />
      </div>
      <div
        v-if="store.loading && !store.sortedCampaigns"
        class="flex flex-wrap gap-4 items-start"
      >
        <SkeletonEncounterCard v-for="i in 10" :key="i" />
      </div>
      <template v-else-if="store.sortedCampaigns?.length">
        <template v-if="isBulk">
          <h2 class="text-danger">
            {{ $t('pages.campaigns.remove.title') }}
          </h2>
          <p class="pt-2 pb-6">
            {{ $t('pages.campaigns.remove.subtitle') }}
          </p>
        </template>
        <div class="flex flex-wrap gap-4 items-start">
          <div
            v-for="campaign in store.sortedCampaigns"
            :key="campaign.id"
            class="relative"
          >
            <div
              v-if="isBulk"
              class="absolute inset-0 z-[1] rounded-lg border-4 cursor-pointer"
              :class="{
                '!border-danger bg-danger/50': selectedCampaigns.find(c => c.id === campaign.id)
              }"
              :style="{ 'border-color': campaign.background }"
              @click="toggleSelection(campaign)"
            />
            <CampaignCard
              :campaign="campaign"
              :selecting="isBulk"
              @update="(v: Campaign) => {
                selectedCampaigns = [v];
                isUpdating = true
              }"
              @remove="(v: Campaign) => {
                selectedCampaigns = [v];
                needConfirmation = true
              }"
            />
          </div>
        </div>
        <div v-if="isBulk" class="flex gap-2 mt-8 mb-2">
          <button
            class="btn-danger"
            :disabled="!selectedCampaigns.length"
            :aria-label="$t('pages.campaigns.remove.amount', {number: selectedCampaigns.length})"
            @click="needConfirmation = true"
          >
            {{ $t('pages.campaigns.remove.amount', {number: selectedCampaigns.length}) }}
          </button>
          <button
            class="btn-success"
            :aria-label="$t('actions.cancel')"
            @click="isBulk = false, selectedCampaigns = []"
          >
            {{ $t('actions.cancel') }}
          </button>
        </div>
      </template>
      <div
        v-else
        class="mx-auto max-w-lg border-4 border-primary p-2 sm:p-10 rounded-lg space-y-4"
      >
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
    <ConfirmationModal
      :open="needConfirmation"
      :title="selectedCampaigns.length === 1
        ? selectedCampaigns[0].title
        : $t('pages.campaigns.remove.multiple', {number: selectedCampaigns.length})
      "
      @close="reset"
      @delete="deleteCampaigns"
    />
    <UpdateCampaignModal
      v-if="selectedCampaigns.length"
      :open="isUpdating"
      :campaign="selectedCampaigns[0]"
      @close="reset"
    />
  </NuxtLayout>
</template>
