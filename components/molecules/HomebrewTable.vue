<script setup lang="ts">
import { isAdmin } from '@/utils/permission-helpers'

const store = useCurrentCampaignStore()
const profile = useProfileStore()
const { t } = useI18n()

const isOpen = ref<boolean>(false)
const isUpdate = ref<boolean>(false)
const selectedHomebrew = ref<Homebrew>()

const search = ref<string>('')
const oldSearch = ref<string>('')
const sortedBy = ref<string>('name')
const sortACS = ref<boolean>(true)
const pages = ref<number>(0)
const page = ref<number>(0)
const perPage = ref<number>(20)
const maxAmount = ref<number>(100)

const headers = computed<TableHeader[]>(() => [
  { label: t('general.name'), sort: true, id: 'name' },
  { label: t('general.type'), sort: true, id: 'type' },
  { label: t('general.player'), sort: true, id: 'player' },
  { label: 'HP', sort: true, id: 'health' },
  { label: 'AC', sort: true, id: 'ac' },
  { label: 'Init mod', sort: false, id: 'initiative_modifier' },
  { label: t('general.link'), sort: false, id: 'link' },
  { label: t('general.actions'), sort: false, id: 'actions' },
  ...(store.campaign && isAdmin(store.campaign, profile.data?.id || '')
    ? [{ label: t('general.modify'), sort: false, id: 'modify' }]
    : []
  )
])

const sorted = computed<Homebrew[]>(() => {
  if (!store.campaign?.homebrew_items || !store.campaign.homebrew_items.length) {
    return []
  }

  let sortedHomebrew = sortArray<Homebrew>(store.campaign.homebrew_items, sortedBy.value, sortACS.value)

  // Handle search input values
  if (search.value) {
    sortedHomebrew = sortedHomebrew
      .filter(hb => hb.name.toLowerCase().includes(search.value?.toLowerCase().trim() || ''))

    if (oldSearch.value !== search.value) {
      page.value = 0
    }

    oldSearch.value = search.value
  }

  // Calculate pages amount
  pages.value = Math.ceil(sortedHomebrew.length / perPage.value)

  // Show only one page of content
  return sortedHomebrew.slice(
    page.value * perPage.value,
    page.value * perPage.value + perPage.value
  )
})
</script>

<template>
  <section class="space-y-4">
    <div class="flex justify-between border-b-2 border-slate-700 pb-1">
      <div class="flex gap-4 items-end">
        <h2>{{ $t('general.homebrew') }}</h2>
        <div class="hidden md:flex gap-1 text-[10px]">
          <p>(Monsters,</p>
          <p>Players,</p>
          <p>Npc's,</p>
          <p>Summons &</p>
          <p>Lair)</p>
        </div>
      </div>
      <div class="flex gap-4 items-center">
        <div
          class="body-small"
          :class="{
            'text-danger': (store.campaign?.homebrew_items || []).length >= maxAmount
          }"
        >
          {{ (store.campaign?.homebrew_items || []).length }} / {{ maxAmount }}
        </div>
        <button
          v-tippy="$t('actions.add')"
          :aria-label="$t('actions.add')"
          class="disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="
            !store.campaign ||
              !isAdmin(store?.campaign, profile.data?.id || '') ||
              (store.campaign?.homebrew_items || []).length >= maxAmount"
          @click="() => {
            selectedHomebrew = undefined
            isUpdate = false
            isOpen = true
          }"
        >
          <Icon
            name="material-symbols:add"
            class="text-success w-6 h-6"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
    <SkeletonTable v-if="store.loading" :headers="headers" />
    <template v-else-if="store?.campaign?.homebrew_items?.length">
      <FormKit
        v-model="search"
        type="search"
        suffix-icon="search"
        outer-class="$reset !pb-0 w-fit"
      />
      <Table
        v-model:sorted-by="sortedBy"
        v-model:acs="sortACS"
        v-model:page="page"
        :headers="headers"
        :pages="pages"
        @paginate="(value) => page = value"
      >
        <tr
          v-for="(item, index) in sorted"
          :key="item.id"
          class="border-b last:border-b-0 border-slate-700"
        >
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
              <NuxtLink v-if="item.link" :to="item.link" target="_blank" rel="noreferrer noopener" class="w-fit">
                <Icon name="ph:link-simple-horizontal" class="w-8 h-8 cursor-pointer text-info" aria-hidden="true" />
              </NuxtLink>
            </div>
          </td>
          <td class="px-2 py-1 border-r border-slate-700">
            <div
              v-if="
                item.actions?.length ||
                  item.legendary_actions?.length ||
                  item.reactions?.length ||
                  item.special_abilities?.length
              "
            >
              <div
                class="flex flex-wrap items-center gap-x-2 cursor-pointer"
                @click="
                  () => {
                    store.activeHomebrew = item
                    store.activeIndex = index
                    store.activeModal = 'possible-attacks-modal'
                  }
                "
              >
                <Icon name="iconamoon:search-bold" class="w-4 h-4 text-primary cursor-pointer" aria-hidden="true" />
                <p>
                  {{
                    `${
                      [
                        ...(item.actions || []),
                        ...(item.legendary_actions || []),
                        ...(item.reactions || []),
                        ...(item.special_abilities || []),
                      ].length
                    }
                        ${$t('components.inputs.actionsLabel')}`
                  }}
                </p>
              </div>
            </div>
          </td>
          <td v-if="isAdmin(store.campaign, profile.data?.id || '')" class="px-2 py-1">
            <div class="flex justify-center items-center gap-1">
              <button
                v-tippy="$t('actions.update')"
                :aria-label="$t('actions.update')"
                @click="() => {
                  selectedHomebrew = item
                  isUpdate = true
                  isOpen = true
                }"
              >
                <Icon
                  name="lucide:wrench"
                  class="text-info w-6 h-6"
                  aria-hidden="true"
                />
              </button>
              <button
                v-tippy="{ content: $t('actions.delete') }"
                :aria-label="$t('actions.delete')"
                @click="store.removeHomebrew(item.id)"
              >
                <Icon
                  name="material-symbols:delete-outline-rounded"
                  class="w-6 h-6 text-danger outline-none"
                  aria-hidden="true"
                />
              </button>
            </div>
          </td>
        </tr>
        <template #empty>
          <div
            v-if="!sorted.length"
            class="max-w-prose mx-auto px-8 py-4 text-center font-bold"
          >
            {{ $t('components.table.nothing', { item: $t('general.homebrew').toLowerCase() }) }}
          </div>
        </template>
      </Table>
      <component
        :is="store.activeModal"
        :open="store.activeModal"
        @close="store.resetActiveState()"
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
