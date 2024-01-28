<script setup lang="ts">
import logRocket from 'logrocket'
import { start, end } from '@/utils/animation-helpers'

definePageMeta({ middleware: ['auth'] })
useHead({ title: 'Campaigns' })

const toast = useToastStore()
const store = useCampaignsStore()
const { t } = useI18n()

const {
  isBulk,
  isUpdating,
  needConfirmation,
  selected,
  toggleSelection,
  reset
} = useBulkEditing()

const isOpen = ref<boolean>(false)
const isTable = ref<boolean>(false)
const search = ref<string>('')
const sortedBy = ref<string>('title')
const sortACS = ref<boolean>(false)

const headers = [
  { label: t('components.inputs.nameLabel'), sort: true, id: 'title' },
  { label: t('general.members'), sort: true, id: 'team' },
  { label: t('general.encounters'), sort: true, id: 'initiative_sheets' },
  { label: t('general.homebrew'), sort: true, id: 'homebrew_items' },
  { label: t('components.encounterTable.headers.modify'), sort: false, id: 'modify' }
]

onMounted(() => {
  store.fetch()
  reset()
})

whenever(() => store.error, () => { toast.error() })

const visibleItems = computed<Campaign[]>(() => {
  if (!store.allowedCampaigns) {
    return []
  }

  const sorted: Campaign[] = sortedBy.value === 'title'
    ? sortByString(store.allowedCampaigns, sortedBy.value, sortACS.value)
    : sortByNumber(store.allowedCampaigns, sortedBy.value, sortACS.value)

  return searchArray<Campaign>(sorted, 'title', search.value)
})

const noItems = computed<boolean>(() => visibleItems.value.length === 0 && !store.loading)

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
  <Layout shadow>
    <div v-if="!store.error">
      <div class="pb-2 flex flex-wrap gap-4 justify-between items-center">
        <h1 class="grow">
          {{ $t('pages.campaigns.campaigns') }}
        </h1>
        <div class="flex items-end gap-2 flex-wrap">
          <span
            v-if="store.campaigns"
            class="text-[10px]"
            :class="{ 'text-danger': store.campaigns.length >= store.max }"
          >
            {{ store.campaigns.length }}/{{ store.max }}
          </span>
          <button
            :aria-label="$t('pages.campaigns.add')"
            :disabled="store.loading || (store.campaigns && store.max <= store.campaigns.length) || isBulk"
            class="btn-small-primary"
            @click="isOpen = true"
          >
            <Icon
              name="material-symbols:add"
              class="h-4 w-4"
              aria-hidden="true"
            />
            {{ $t('pages.campaigns.add') }}
          </button>
          <button
            v-tippy="$t('actions.bulkRemove')"
            :aria-label="$t('actions.bulkRemove')"
            :disabled="store.loading"
            class="btn-small-danger"
            @click="() => {
              isBulk = !isBulk;
              if (!isBulk) {
                reset()
              }
            }"
          >
            <Icon
              name="material-symbols:delete-outline-rounded"
              class="h-4 w-4"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
      <template v-if="store.loading && !store.allowedCampaigns">
        <SkeletonContentHeader />
        <SkeletonTable v-if="isTable" :headers="headers" />
        <div v-else class="flex flex-wrap gap-4 items-start">
          <SkeletonEncounterCard v-for="i in 10" :key="i" />
        </div>
      </template>
      <template v-else-if="store.allowedCampaigns?.length">
        <ContentHeader v-model:grid="isTable" v-model:search="search" />
        <Transition name="expand" @enter="start" @after-enter="end" @before-leave="start" @after-leave="end">
          <div v-if="isBulk">
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
                :aria-label="$t('pages.campaigns.remove.amount', { number: selected.length })"
                @click="needConfirmation = true"
              >
                {{ $t('pages.campaigns.remove.amount', { number: selected.length }) }}
              </button>
              <button
                class="btn-success"
                :aria-label="$t('actions.cancel')"
                @click="isBulk = false, selected = []"
              >
                {{ $t('actions.cancel') }}
              </button>
            </div>
          </div>
        </Transition>
        <LimitCta
          v-if="!isBulk && store.campaigns && store.max <= store.campaigns.length"
          class="mb-10"
        />
        <Table
          v-show="isTable"
          v-model:sorted-by="sortedBy"
          v-model:acs="sortACS"
          :headers="headers"
        >
          <tr
            v-for="item in visibleItems"
            :key="item.id"
            class="tr transition-colors"
            :class="{
              'bg-danger/20': selected.find(c => c.id === item.id)
            }"
          >
            <td
              v-for="td in [
                item.title,
                (item.team?.length || 0) + 1,
                item.initiative_sheets?.length || 0,
                item.homebrew_items?.length || 0
              ]"
              :key="td"
              class="td"
            >
              {{ td }}
            </td>
            <td class="td">
              <div class="flex justify-center items-center gap-1">
                <FormKit
                  v-if="isBulk"
                  name="marketing"
                  type="checkbox"
                  :label="$t('actions.select')"
                  :value="!!selected.find(c => c.id === item.id)"
                  outer-class="$reset !pb-0"
                  @click="toggleSelection(item)"
                />
                <template v-else>
                  <button
                    v-tippy="$t('actions.update')"
                    :aria-label="$t('actions.update')"
                    @click="() => {
                      selected = [item];
                      isUpdating = true
                    }"
                  >
                    <Icon
                      name="lucide:wrench"
                      class="text-info w-6 h-6"
                      aria-hidden="true"
                    />
                  </button>
                  <button
                    v-tippy="$t('actions.delete')"
                    :aria-label="$t('actions.delete')"
                    @click="() => {
                      selected = [item];
                      needConfirmation = true
                    }"
                  >
                    <Icon
                      name="material-symbols:delete-outline-rounded"
                      class="w-6 h-6 text-danger outline-none"
                      aria-hidden="true"
                    />
                  </button>
                </template>
              </div>
            </td>
          </tr>
          <template #empty>
            <div
              v-if="noItems"
              class="max-w-prose mx-auto px-8 py-4 text-center font-bold"
            >
              {{ $t('components.table.nothing', { item: $t('general.campaigns').toLowerCase() }) }}
            </div>
          </template>
        </Table>
        <div v-show="!isTable" class="flex flex-wrap gap-4 items-start">
          <div
            v-for="campaign in visibleItems"
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
          <div
            v-if="noItems"
            class="max-w-prose mx-auto px-8 py-4 text-center font-bold"
          >
            {{ $t('components.table.nothing', { item: $t('general.campaigns').toLowerCase() }) }}
          </div>
        </div>
      </template>
      <NoContent
        v-else
        :content="$t('general.campaigns').toLowerCase()"
        icon="fa6-solid:dungeon"
        class="mt-20"
      />
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
    <CampaignModal
      :open="isOpen || (isUpdating && !!selected.length)"
      :campaign="selected.length ? selected[0] : undefined"
      :update="isUpdating"
      @close="() => {
        isOpen = false
        reset();
      }"
    />
  </Layout>
</template>
