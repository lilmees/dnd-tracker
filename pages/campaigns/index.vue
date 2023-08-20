<script setup lang="ts">
import logRocket from 'logrocket'

definePageMeta({ middleware: ['auth'] })
useHead({ title: 'Campaigns' })

const toast = useToastStore()
const store = useCampaignsStore()

const {
  isBulk,
  isUpdating,
  needConfirmation,
  selected,
  toggleSelection,
  reset
} = useBulkEditing()

const isOpen = ref<boolean>(false)

onMounted(() => store.fetch())

whenever(() => store.error, () => { toast.error() })

async function deleteCampaigns (): Promise<void> {
  try {
    if (selected.value.length === 1) {
      await store.deleteCampaign(selected.value[0].id)
    } else if (selected.value.length > 1) {
      await store.bulkDeleteCampaigns(selected.value.map(v => v.id))
    }
  } catch (err) {
    logRocket.captureException(err as Error)
    toast.error()
  } finally {
    reset()
  }
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
          <div class="flex gap-2 mb-12">
            <button
              class="btn-danger"
              :disabled="!selected.length"
              :aria-label="$t('pages.campaigns.remove.amount', {number: selected.length})"
              @click="needConfirmation = true"
            >
              {{ $t('pages.campaigns.remove.amount', {number: selected.length}) }}
            </button>
            <button
              class="btn-success"
              :aria-label="$t('actions.cancel')"
              @click="isBulk = false, selected = []"
            >
              {{ $t('actions.cancel') }}
            </button>
          </div>
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
                '!border-danger bg-danger/50': selected.find(c => c.id === campaign.id)
              }"
              :style="{ 'border-color': campaign.background }"
              @click="toggleSelection(campaign)"
            />
            <CampaignCard
              :campaign="campaign"
              :selecting="isBulk"
              @update="(v: Campaign) => {
                selected = [v];
                isUpdating = true
              }"
              @remove="(v: Campaign) => {
                selected = [v];
                needConfirmation = true
              }"
            />
          </div>
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
      :title="selected.length === 1
        ? selected[0].title
        : $t('pages.campaigns.remove.multiple', {number: selected.length})
      "
      @close="reset"
      @delete="deleteCampaigns"
    />
    <UpdateCampaignModal
      v-if="selected.length"
      :open="isUpdating"
      :campaign="selected[0]"
      @close="reset"
    />
  </NuxtLayout>
</template>
