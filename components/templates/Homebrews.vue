<script setup lang="ts">
const homebrewStore = useHomebrewStore()
const currentStore = useCurrentCampaignStore()
const profile = useProfileStore()
const { t } = useI18n()

const isOpen = ref<boolean>(false)
const isUpdate = ref<boolean>(false)
const selectedHomebrew = ref<Homebrew>()
const isBulk = ref<boolean>(false)
const isUpdating = ref<boolean>(false)
const needConfirmation = ref<boolean>(false)
const selected = ref<Homebrew[]>([])

const headers = computed<TableHeader[]>(() => [
  { label: '', sort: false, id: '' },
  { label: t('general.name'), sort: true, id: 'name' },
  { label: t('general.type'), sort: true, id: 'type' },
  { label: t('general.player'), sort: true, id: 'player' },
  { label: 'HP', sort: true, id: 'health' },
  { label: 'AC', sort: true, id: 'ac' },
  { label: 'Init mod', sort: false, id: 'initiative_modifier' },
  { label: t('general.link'), sort: false, id: 'link' },
  { label: t('general.actions'), sort: false, id: 'actions' },
  ...(currentStore.campaign && isAdmin(currentStore.campaign, profile.data?.id || '')
    ? [{ label: t('general.modify'), sort: false, id: 'modify' }]
    : []
  )
])

onBeforeUnmount(() => homebrewStore.resetPagination())

whenever(() => currentStore.campaign, () => {
  if (currentStore.campaign) {
    homebrewStore.fetch({ field: 'campaign', value: currentStore.campaign.id })
  }
})

function resetState (): void {
  needConfirmation.value = false
  isBulk.value = false
  isUpdating.value = false
  selected.value = []
  isOpen.value = false
}

function getActionsAmount (item: Homebrew): number {
  return [
    ...(item.actions || []),
    ...(item.legendary_actions || []),
    ...(item.reactions || []),
    ...(item.special_abilities || [])
  ].length
}
</script>

<template>
  <section class="space-y-4">
    <div class="flex justify-between border-b-2 border-slate-700 pb-1">
      <div class="flex gap-4 items-end">
        <h2>{{ $t('general.homebrew') }}</h2>
        <div class="hidden md:flex gap-1 text-[12px]">
          <p>(Monsters,</p>
          <p>Players,</p>
          <p>Npc's,</p>
          <p>Summons &</p>
          <p>Lair)</p>
        </div>
      </div>
      <div class="flex gap-2 items-end flex-wrap">
        <div
          class="body-small"
          :class="{
            'text-danger': homebrewStore.homebrewCount >= homebrewStore.max
          }"
        >
          {{ homebrewStore.homebrewCount }} / {{ homebrewStore.max }}
        </div>
        <button
          class="btn-small-primary"
          :aria-label="$t('actions.createItem', { item: $t('general.homebrew') })"
          :disabled="
            !currentStore.campaign ||
              !isAdmin(currentStore?.campaign, profile.data?.id || '') ||
              homebrewStore.homebrewCount >= homebrewStore.max
          "
          @click="isOpen = true"
        >
          {{ $t('actions.createItem', { item: $t('general.homebrew') }) }}
        </button>
        <button
          v-tippy="$t('actions.bulkRemove')"
          :aria-label="$t('actions.bulkRemove')"
          :disabled="homebrewStore.loading || homebrewStore.searching"
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
    <ul>
      <li>Homebrew update not working</li>
      <li>Add searching/disabled to all tables</li>
      <li>Test when error is thrown in homebrewmodal if the emit still gets called</li>
      <li>Change bulk delete functions to always allow bulk delete</li>
      <li>encounter page not table when tomuch items</li>
      <li>test actions and if table updates afterwards</li>
      <li>test if homebrew modal en encounter page works</li>
      <li>remove usebulkediting composable</li>
    </ul>
    <SkeletonTable v-if="homebrewStore.loading" :headers="headers" shadow />
    <template v-else-if="(!homebrewStore.noItems || homebrewStore.filters.search && homebrewStore.noItems) && currentStore.campaign">
      <FormKit
        v-model="homebrewStore.filters.search"
        type="search"
        suffix-icon="search"
        outer-class="$reset !pb-0 w-fit"
      />
      <BulkRemove
        v-model:isBulk="isBulk"
        v-model:needConfirmation="needConfirmation"
        v-model:selected="selected"
        type="homebrews"
      />
      <Table
        v-model:sorted-by="homebrewStore.filters.sortedBy"
        v-model:acs="homebrewStore.filters.sortACS"
        v-model:page="homebrewStore.page"
        :headers="headers"
        :pages="homebrewStore.pages"
        :searching="homebrewStore.searching"
        shadow
        @paginate="(p) => {
          homebrewStore.paginate(
            p,
            { field: 'campaign', value: currentStore.campaign!.id }
          )
        }"
      >
        <tr
          v-for="(item, index) in homebrewStore.data"
          :key="item.id"
          class="tr transition-colors"
          :class="{
            'bg-danger/20': isBulk && selected.find(c => c.id === item.id)
          }"
        >
          <td class="py-1 px-2 border-r last:border-r-0 border-slate-700 max-w-10 text-slate-300">
            {{ (index + 1) + (homebrewStore.page * homebrewStore.perPage) }}
          </td>
          <td class="px-2 py-1 border-r border-slate-700 relative">
            {{ item.name }}
          </td>
          <td class="px-2 py-1 border-r border-slate-700">
            <div class="flex gap-2 items-center">
              <Icon
                :name="useHomebrewIcon(item.type)"
                :class="useHomebrewColor(item.type)"
                size="20"
                aria-hidden="true"
              />
              <p>
                {{ item.type || '' }}
              </p>
            </div>
          </td>
          <td class="px-2 py-1 border-r border-slate-700 relative">
            {{ item.player || '' }}
          </td>
          <td class="px-2 py-1 border-r border-slate-700">
            {{ item.type === 'lair' ? '' : item.health || '' }}
          </td>
          <td class="px-2 py-1 border-r border-slate-700">
            {{ item.type === 'lair' ? '' : item.ac || '' }}
          </td>
          <td class="px-2 py-1 border-r border-slate-700">
            {{ item.type === 'lair' ? '' : item.initiative_modifier || '' }}
          </td>
          <td class="px-2 py-1 border-r border-slate-700">
            <div class="flex justify-center">
              <NuxtLink
                v-if="item.link"
                v-tippy="$t('actions.link')"
                :to="item.link"
                target="_blank"
                rel="noreferrer noopener"
                class="w-fit icon-btn-info"
              >
                <Icon name="ph:link-simple-horizontal" class="w-8 h-8" aria-hidden="true" />
              </NuxtLink>
            </div>
          </td>
          <td class="px-2 py-1 border-r border-slate-700">
            <button
              v-if="getActionsAmount(item)"
              class="flex items-center gap-x-2 icon-btn-primary"
              @click="
                () => {
                  currentStore.activeHomebrew = item
                  currentStore.activeIndex = index
                  currentStore.activeModal = 'possible-attacks-modal'
                }
              "
            >
              <Icon name="iconamoon:search-bold" class="w-4 h-4" aria-hidden="true" />
              <span class="whitespace-nowrap">
                {{ `${getActionsAmount(item)} ${$t('components.inputs.actionsLabel')}` }}
              </span>
            </button>
          </td>
          <td
            v-if="currentStore.campaign && isAdmin(currentStore.campaign, profile.data?.id || '')"
            class="px-2 py-1"
          >
            <div class="flex justify-center items-center gap-2">
              <FormKit
                v-if="isBulk"
                name="marketing"
                type="checkbox"
                :label="$t('actions.select')"
                :value="!!selected.find(c => c.id === item.id)"
                outer-class="$reset !pb-0"
                @click="toggleSelection<Homebrew>(item, selected)"
              />
              <template v-else>
                <button
                  v-tippy="$t('actions.update')"
                  class="icon-btn-info"
                  :aria-label="$t('actions.update')"
                  @click="() => {
                    selected = [item];
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
                  v-tippy="{ content: $t('actions.delete') }"
                  class="icon-btn-danger"
                  :aria-label="$t('actions.delete')"
                  @click="() => {
                    selected = [item];
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
            v-if="homebrewStore.noItems"
            class="max-w-prose mx-auto px-8 py-4 text-center font-bold"
          >
            {{ $t('components.table.nothing', { item: $t('general.homebrew').toLowerCase() }) }}
          </div>
        </template>
      </Table>
      <component
        :is="currentStore.activeModal"
        :open="currentStore.activeModal"
        @close="currentStore.resetActiveState()"
      />
      <ConfirmationModal
        :open="needConfirmation"
        :title="selected.length === 1
          ? selected[0].name
          : $t('components.bulkRemove.multiple', {
            number: selected.length,
            type: $t('general.homebrews').toLowerCase()
          })"
        @close="resetState"
        @delete="() => {
          homebrewStore.deleteHomebrew(
            selected.length === 1 ? selected[0].id : selected.map(v => v.id)
          );
          resetState()
        }"
      />
    </template>
    <NoContent v-else content="homebrew" icon="la:dragon" />
    <HomebrewModal
      :open="isOpen"
      :update="isUpdate"
      :item="selectedHomebrew"
      @close="isOpen = false"
      @updated="isOpen = false"
    />
  </section>
</template>
