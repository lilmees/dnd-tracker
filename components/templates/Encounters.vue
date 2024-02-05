<script setup lang="ts">
import logRocket from 'logrocket'

const props = withDefaults(
  defineProps<{
    campaignView?: boolean
  }>(), {
    campaignView: false
  }
)

const currentStore = useCurrentCampaignStore()
const encounterStore = useEncountersStore()
const profile = useProfileStore()
const toast = useToastStore()
const { error } = storeToRefs(encounterStore)
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
const sortedBy = ref<string>('title')
const sortACS = ref<boolean>(false)

const headers = [
  { label: '', sort: false, id: '' },
  { label: t('general.name'), sort: true, id: 'title' },
  { label: t('general.campaign'), sort: true, id: 'campaign.title' },
  { label: t('general.rows'), sort: true, id: 'rows' },
  { label: t('general.actions'), sort: false, id: 'actions' }
]

onMounted(() => {
  reset()
  props.campaignView
    ? isTable.value = true
    : encounterStore.fetch()
})

onBeforeUnmount(() => encounterStore.resetPagination())

whenever(error, () => { toast.error() })

whenever(() => currentStore.campaign, () => {
  if (currentStore.campaign) {
    encounterStore.fetch({ field: 'campaign', value: currentStore.campaign.id })
  }
})

watchDebounced(() => encounterStore.search, async () => {
  encounterStore.page = 0
  props.campaignView && currentStore.campaign
    ? await encounterStore.fuzzySearchEncounters({ field: 'campaign', value: currentStore.campaign.id })
    : await encounterStore.fuzzySearchEncounters()
}, { debounce: 250, maxWait: 500 })

const visibleItems = computed<Encounter[]>(() => {
  if (!encounterStore.restrictionEncounters) {
    return []
  }

  return sortArray<Encounter>(encounterStore.restrictionEncounters, sortedBy.value, sortACS.value)
})

const noItems = computed<boolean>(() => visibleItems.value.length === 0 && !encounterStore.loading)

const toMuchItems = computed<boolean>(() => {
  const toMuch = encounterStore.encounterCount >= encounterStore.perPage
  if (toMuch) {
    isTable.value = true
  }

  return toMuch
})

async function deleteEncounter (): Promise<void> {
  try {
    if (selected.value.length === 1) {
      await encounterStore.deleteEncounter(selected.value[0].id)
    } else if (selected.value.length > 1) {
      await encounterStore.bulkDeleteEncounters(selected.value.map(v => v.id))
    }
  } catch (err) {
    logRocket.captureException(err as Error)
    toast.error()
  } finally {
    resetState()
  }
}

async function copyEncounter (enc : Encounter): Promise<void> {
  try {
    await encounterStore.copyEncounter(enc)
  } catch (err) {
    logRocket.captureException(err as Error)
    toast.error()
  } finally {
    resetState()
  }
}

function resetState (): void {
  reset()
  isOpen.value = false
}
</script>

<template>
  <div v-if="!encounterStore.error">
    <div class="border-b-2 border-slate-700 pb-1 flex justify-between gap-4 items-center flex-wrap mb-6">
      <h1 class="grow">
        {{ $t('pages.encounters.encounters') }}
        <span class="text-[10px]">
          ({{ $t('components.limitCta.max', { number: encounterStore.max }) }})
        </span>
      </h1>
      <div class="flex gap-2 items-center flex-wrap">
        <div
          class="body-small"
          :class="{
            'text-danger': encounterStore.encounterCount >= encounterStore.max
          }"
        >
          {{ encounterStore.encounterCount }} / {{ encounterStore.max }}
        </div>
        <button
          class="btn-small-primary"
          :aria-label="$t('pages.encounters.add')"
          :disabled="
            campaignView
              ? !currentStore.campaign || !isAdmin(currentStore.campaign, profile.data?.id || '')
              : encounterStore.max <= encounterStore.encounterCount
          "
          @click="isOpen = true"
        >
          {{ $t('pages.encounters.add') }}
        </button>
        <button
          v-tippy="$t('actions.bulkRemove')"
          :aria-label="$t('actions.bulkRemove')"
          :disabled="encounterStore.loading"
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
    <template v-if="encounterStore.loading">
      <SkeletonContentHeader :hide-toggle="campaignView" />
      <SkeletonTable v-if="isTable" :headers="headers" />
      <div v-else class="flex flex-wrap gap-4 items-start">
        <SkeletonEncounterCard v-for="i in 10" :key="i" />
      </div>
    </template>
    <div v-else-if="visibleItems">
      <ContentHeader
        v-model:grid="isTable"
        v-model:search="encounterStore.search"
        :to-much="toMuchItems"
        :hide-toggle="campaignView"
      />
      <LimitCta v-if="!isBulk && encounterStore.max <= encounterStore.encounterCount" class="mb-10" />
      <Transition name="expand" @enter="start" @after-enter="end" @before-leave="start" @after-leave="end">
        <div v-if="isBulk">
          <h2 class="text-danger">
            {{ $t('pages.encounters.remove.title') }}
          </h2>
          <p class="pt-2 pb-6">
            {{ $t('pages.encounters.remove.subtitle') }}
          </p>
          <div class="flex gap-2 mb-12">
            <button
              class="btn-danger"
              :disabled="!selected.length"
              :aria-label="$t('pages.encounters.remove.amount', {number: selected.length})"
              @click="needConfirmation = true"
            >
              {{ $t('pages.encounters.remove.amount', {number: selected.length}) }}
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
      <Table
        v-show="isTable"
        v-model:sorted-by="sortedBy"
        v-model:acs="sortACS"
        :headers="headers"
        shadow
        :pages="encounterStore.pages"
        @paginate="(p) => {
          encounterStore.paginate(
            p,
            props.campaignView && currentStore.campaign
              ? { field: 'campaign', value: currentStore.campaign.id }
              : undefined
          )
        }"
      >
        <tr
          v-for="(encounter, i) in visibleItems"
          :key="encounter.id"
          class="tr transition-colors"
          :class="{
            'bg-danger/20': selected.find(c => c.id === encounter.id)
          }"
        >
          <td class="py-1 px-2 border-r last:border-r-0 border-slate-700 max-w-5 text-slate-300">
            {{ (i + 1) + (encounterStore.page * encounterStore.perPage) }}
          </td>
          <td class="td">
            <RouteLink
              :url="encounterUrl(encounter)"
              class="underline underline-offset-2 decoration-primary"
            >
              {{ encounter.title }}
            </RouteLink>
          </td>
          <td class="td">
            <RouteLink
              v-if="encounter.campaign"
              :url="campaignUrl(encounter.campaign, 'content')"
              class="underline underline-offset-2 decoration-primary"
            >
              {{ encounter.campaign.title }}
            </RouteLink>
          </td>
          <td class="td">
            {{ encounter.rows.length }}
          </td>
          <td class="td">
            <div class="flex justify-center items-center gap-1">
              <FormKit
                v-if="isBulk"
                name="marketing"
                type="checkbox"
                :label="$t('actions.select')"
                :value="!!selected.find(c => c.id === encounter.id)"
                outer-class="$reset !pb-0"
                @click="toggleSelection(encounter)"
              />
              <template v-else>
                <button
                  v-tippy="$t('actions.share')"
                  :aria-label="$t('actions.share')"
                  @click="encounterStore.shareEncounter(encounter)"
                >
                  <Icon
                    name="material-symbols:share"
                    class="text-success w-6 h-6"
                    aria-hidden="true"
                  />
                </button>
                <button
                  v-tippy="$t('actions.update')"
                  :aria-label="$t('actions.update')"
                  @click="() => {
                    selected = [encounter];
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
                    selected = [encounter];
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
            {{ $t('components.table.nothing', { item: $t('general.encounters').toLowerCase() }) }}
          </div>
        </template>
      </Table>
      <div v-show="!isTable" class="flex flex-wrap gap-4 items-start">
        <div
          v-for="encounter in visibleItems"
          :key="encounter.id"
          class="relative"
        >
          <div
            v-if="isBulk"
            class="absolute inset-0 z-[1] rounded-lg border-4 cursor-pointer"
            :class="{
              '!border-danger bg-danger/50': selected.find(e => e.id === encounter.id)
            }"
            :style="{ 'border-color': encounter.background }"
            @click="toggleSelection(encounter)"
          />
          <EncounterCard
            :encounter="encounter"
            :disable-copy="encounterStore.max <= encounterStore.data.length"
            @update="(v: Encounter) => {
              selected = [v];
              isUpdating = true
            }"
            @remove="(v: Encounter) => {
              selected = [v];
              needConfirmation = true
            }"
            @copy="copyEncounter(encounter)"
            @share="encounterStore.shareEncounter"
          />
        </div>
      </div>
    </div>
    <NoContent v-else content="encounters" icon="ri:table-line" />
  </div>
  <div v-else class="max-w-sm mx-auto py-20 space-y-4">
    <h2 class="text-center text-danger">
      {{ $t('general.error.text') }}
    </h2>
    <button
      class="btn-black w-full"
      :aria-label="$t('actions.tryAgain')"
      @click="encounterStore.fetch()"
    >
      {{ $t('actions.tryAgain') }}
    </button>
  </div>
  <div class="absolute z-[1]">
    <ConfirmationModal
      :open="needConfirmation"
      :title="selected.length === 1
        ? selected[0].title
        : $t('pages.encounters.remove.multiple', {number: selected.length})"
      @close="resetState"
      @delete="deleteEncounter"
    />
    <EncounterModal
      :open="isUpdating || isOpen"
      :encounter="selected.length && isUpdating ? selected[0] : undefined"
      :campaign="campaignView && currentStore.campaign ? currentStore.campaign.id : undefined"
      :update="isUpdating"
      @close="resetState"
      @updated="resetState"
      @added="resetState"
    />
  </div>
</template>
