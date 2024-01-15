<script setup lang="ts">
import { isAdmin } from '@/utils/permission-helpers'

const store = useCurrentCampaignStore()
const profile = useProfileStore()

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

const sorted = computed<Homebrew[]>(() => {
  if (!store.campaign?.homebrew_items || !store.campaign.homebrew_items.length) {
    return []
  }

  let sortedHomebrew: Homebrew[] = []

  if (['health', 'ac'].includes(sortedBy.value)) {
    sortedHomebrew = sortByNumber(store.campaign.homebrew_items, sortedBy.value)
  } else if (['name', 'type', 'player'].includes(sortedBy.value)) {
    sortedHomebrew = sortByString(store.campaign.homebrew_items, sortedBy.value)
  }

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

function setSorting (header: string): void {
  const key = header === 'hp' ? 'health' : header
  sortACS.value = key === sortedBy.value ? !sortACS.value : false
  sortedBy.value = key
}

function sortByNumber (arr: Homebrew[], key: string): Homebrew[] {
  return arr.sort((a: Homebrew, b: Homebrew) => {
    const aValue = a[key as keyof Homebrew] as number
    const bValue = b[key as keyof Homebrew] as number

    if (aValue === null || aValue === undefined) {
      return bValue === null || bValue === undefined ? 0 : 1
    } else if (bValue === null || bValue === undefined) {
      return -1
    }

    return sortACS.value ? aValue - bValue : bValue - aValue
  })
}

function sortByString (arr: Homebrew[], key: string): Homebrew[] {
  return arr.sort((a: Homebrew, b: Homebrew) => {
    const aValue: string = a[key as keyof Homebrew] as string
    const bValue: string = b[key as keyof Homebrew] as string

    if (!aValue && !bValue) {
      return 0
    } else if (!aValue) {
      return 1
    } else if (!bValue) {
      return -1
    }

    return sortACS.value ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
  })
}
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
    <SkeletonHomebrewTable v-if="store.loading" />
    <template v-else-if="store?.campaign?.homebrew_items?.length">
      <FormKit
        v-model="search"
        type="search"
        suffix-icon="search"
        outer-class="$reset !pb-0 w-fit"
      />
      <div
        class="inline-block overflow-x-auto overflow-y-hidden w-full"
      >
        <div class="bg-tracker/50 border-4 border-tracker rounded-lg">
          <table class="min-w-full">
            <thead>
              <tr>
                <th
                  v-for="header in isAdmin(store.campaign, profile.data?.id || '')
                    ? ['name', 'type', 'player', 'hp', 'ac', 'init mod', 'link', 'actions', 'modify']
                    : ['name', 'type', 'player', 'hp', 'ac', 'init mod', 'link', 'actions']"
                  :key="header"
                  class="py-3 px-2 border-b border-r last:border-r-0 border-slate-700"
                  :class="{
                    'cursor-pointer': ['name', 'type', 'player', 'hp', 'ac'].includes(header),
                  }"
                  @click="setSorting(header)"
                >
                  <div class="flex gap-2 justify-center items-center">
                    <p class="uppercase">
                      {{ header }}
                    </p>
                    <Icon
                      name="ph:arrows-down-up-bold"
                      class="w-5 h-5 cursor-pointer text-secondary/50"
                      :class="{
                        '!hidden': ['init mod', 'link', 'actions', 'modify'].includes(header),
                        '!text-secondary': sortedBy === (header === 'hp' ? 'health' : header),
                      }"
                      aria-hidden="true"
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
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
            </tbody>
          </table>
          <div v-if="!sorted.length" class="px-8 py-4 text-center body-small mx-auto max-w-prose">
            {{ $t('components.homebrewTable.nothing') }}
          </div>
        </div>
        <Pagination
          v-if="pages > 1"
          v-model="page"
          :total-pages="pages"
          @paginate="(value) => page = value"
        />
        <component :is="store.activeModal" :open="store.activeModal" @close="store.resetActiveState()" />
      </div>
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
