<script setup lang="ts">
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

const isOpen = ref<boolean>(false)
const isTable = ref<boolean>(false)
const isBulk = ref<boolean>(false)
const isUpdating = ref<boolean>(false)
const needConfirmation = ref<boolean>(false)
const selected = ref<Encounter[]>([])

const headers = [
  { label: '', sort: false, id: '' },
  { label: t('general.name'), sort: true, id: 'title' },
  ...(props.campaignView ? [] : [{ label: t('general.campaign'), sort: false, id: 'campaign.title' }]),
  { label: t('general.rows'), sort: false, id: 'rows' },
  { label: t('general.actions'), sort: false, id: 'actions' }
]

onMounted(() => {
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

watchDebounced(() => encounterStore.filters, async () => {
  encounterStore.page = 0
  await encounterStore.fetch(
    props.campaignView && currentStore.campaign
      ? { field: 'campaign', value: currentStore.campaign.id }
      : undefined,
    true
  )
}, { debounce: 100, maxWait: 500, deep: true })

const toMuch = computed<boolean>(() => encounterStore.encounterCount >= encounterStore.perPage)

function resetState (): void {
  needConfirmation.value = false
  isBulk.value = false
  isUpdating.value = false
  selected.value = []
  isOpen.value = false
}
</script>

<template>
  <div v-if="!encounterStore.error">
    <div class="flex justify-between border-b-2 border-slate-700 pb-1 mb-4">
      <div class="flex items-end gap-2">
        <h2>{{ $t('pages.encounters.encounters') }}</h2>
        <span class="text-[12px]">
          ({{ $t('components.limitCta.max', { number: encounterStore.max }) }})
        </span>
      </div>
      <div class="flex gap-2 items-end flex-wrap">
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
          :aria-label="$t('actions.createItem', { item: $t('general.encounter') })"
          :disabled="
            campaignView
              ? !currentStore.campaign || !isAdmin(currentStore.campaign, profile.data?.id || '')
              : encounterStore.max <= encounterStore.encounterCount
          "
          @click="isOpen = true"
        >
          {{ $t('actions.createItem', { item: $t('general.encounter') }) }}
        </button>
        <button
          v-tippy="$t('actions.bulkRemove')"
          :aria-label="$t('actions.bulkRemove')"
          :disabled="encounterStore.loading || encounterStore.searching"
          class="btn-small-danger"
          @click="() => {
            isBulk = !isBulk;
            if (!isBulk) {
              resetState()
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
    <div v-else-if="encounterStore.restrictionEncounters">
      <ContentHeader
        v-model:grid="isTable"
        v-model:search="encounterStore.filters.search"
        :to-much="toMuch"
        :hide-toggle="campaignView"
        :shadow="!campaignView"
      />
      <LimitCta v-if="!isBulk && encounterStore.max <= encounterStore.encounterCount" class="mb-10" />
      <BulkRemove
        v-model:isBulk="isBulk"
        v-model:needConfirmation="needConfirmation"
        v-model:selected="selected"
        type="encounters"
      />
      <Table
        v-show="isTable"
        v-model:sorted-by="encounterStore.filters.sortedBy"
        v-model:acs="encounterStore.filters.sortACS"
        :headers="headers"
        :pages="encounterStore.pages"
        :searching="encounterStore.searching"
        shadow
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
          v-for="(encounter, i) in encounterStore.restrictionEncounters"
          :key="encounter.id"
          class="tr transition-colors"
          :class="{
            'bg-danger/20': isBulk && selected.find(c => c.id === encounter.id)
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
          <td v-if="!campaignView" class="td">
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
            <div class="flex justify-center items-center gap-2">
              <FormKit
                v-if="isBulk"
                name="marketing"
                type="checkbox"
                :label="$t('actions.select')"
                :value="!!selected.find(c => c.id === encounter.id)"
                outer-class="$reset !pb-0"
                @click="toggleSelection<Encounter>(encounter, selected)"
              />
              <template v-else>
                <button
                  v-tippy="$t('actions.share')"
                  class="icon-btn-success"
                  :aria-label="$t('actions.share')"
                  @click="encounterStore.shareEncounter(encounter)"
                >
                  <Icon
                    name="material-symbols:share"
                    class="w-6 h-6"
                    aria-hidden="true"
                  />
                </button>
                <button
                  v-tippy="$t('actions.copy')"
                  class="icon-btn-primary"
                  :aria-label="$t('actions.copy')"
                  @click="encounterStore.copyEncounter(encounter)"
                >
                  <Icon
                    name="material-symbols:content-copy-outline-rounded"
                    class="w-6 h-6"
                    aria-hidden="true"
                  />
                </button>
                <button
                  v-tippy="$t('actions.update')"
                  class="icon-btn-info"
                  :aria-label="$t('actions.update')"
                  @click="() => {
                    selected = [encounter];
                    isUpdating = true
                  }"
                >
                  <Icon
                    name="lucide:wrench"
                    class="w-6 h-6"
                    aria-hidden="true"
                  />
                </button>
                <button
                  v-tippy="$t('actions.delete')"
                  class="icon-btn-danger"
                  :aria-label="$t('actions.delete')"
                  @click="() => {
                    selected = [encounter];
                    needConfirmation = true
                  }"
                >
                  <Icon
                    name="material-symbols:delete-outline-rounded"
                    class="w-6 h-6"
                    aria-hidden="true"
                  />
                </button>
              </template>
            </div>
          </td>
        </tr>
        <template #empty>
          <div
            v-if="encounterStore.noItems"
            class="max-w-prose mx-auto px-8 py-4 text-center font-bold"
          >
            {{ $t('components.table.nothing', { item: $t('general.encounters').toLowerCase() }) }}
          </div>
        </template>
      </Table>
      <div v-show="!isTable" class="flex flex-wrap gap-4 items-start">
        <div
          v-for="encounter in encounterStore.restrictionEncounters"
          :key="encounter.id"
          class="relative"
        >
          <BulkRemoveCard
            v-if="isBulk"
            :selected="!!selected.find(e => e.id === encounter.id)"
            :border="encounter.background"
            @toggled="toggleSelection<Encounter>(encounter, selected)"
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
            @copy="encounterStore.copyEncounter"
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
        : $t('components.bulkRemove.multiple', {
          number: selected.length,
          type: $t('general.encounters').toLowerCase()
        })"
      @close="resetState"
      @delete="() => {
        encounterStore.deleteEncounter(
          selected.length === 1 ? selected[0].id : selected.map(v => v.id)
        );
        resetState()
      }"
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
