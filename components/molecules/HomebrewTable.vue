<script setup lang="ts">
const store = useCurrentCampaignStore()

const sortedBy = ref<string>('name')
const sortACS = ref<boolean>(true)
const sortedHomebrew = ref<Homebrew[]>([])

const pages = ref<number>(0)
const page = ref<number>(0)
const perPage = ref<number>(20)
const shownHomebrew = ref<Homebrew[]>([])

watch(() => store.campaign?.homebrew_items, (v) => {
  if (v) {
    sortACS.value = true
    sortedHomebrew.value = sortByString(v, 'name')
    pages.value = Math.ceil(sortedHomebrew.value.length / perPage.value)
    paginate(0)
  }
}, { immediate: true })

function sortItems (key: string): void {
  if (!store.campaign?.homebrew_items) {
    return
  }

  if (key === sortedBy.value) {
    sortACS.value = !sortACS.value
  }

  sortedBy.value = key

  let sorted: Homebrew[] = []

  if (key === 'health' || key === 'ac') {
    sorted = sortByNumber(store.campaign.homebrew_items, key)
  } else if (key === 'name' || key === 'type') {
    sorted = sortByString(store.campaign.homebrew_items, key)
  }

  sortedHomebrew.value = sorted
  pages.value = Math.ceil(sorted.length / perPage.value)
  paginate(0)
}

function sortByNumber (arr: Homebrew[], key: string): Homebrew[] {
  return arr.sort((a: Homebrew, b: Homebrew) => {
    const aValue = a[key as keyof Homebrew]
    const bValue = b[key as keyof Homebrew]

    if (aValue === null || aValue === undefined) {
      return 1
    } else if (bValue === null || bValue === undefined) {
      return -1
    } else if (sortACS.value) {
      return aValue < bValue ? -1 : 1
    } else if (!sortACS.value) {
      return aValue < bValue ? 1 : -1
    } else {
      return 0
    }
  })
}

function sortByString (arr: Homebrew[], key: string): Homebrew[] {
  return arr.sort((a: Homebrew, b: Homebrew) => {
    const aValue: string = a[key as keyof Homebrew] as string
    const bValue: string = b[key as keyof Homebrew] as string

    if (!aValue || !bValue) {
      return 0
    }

    return sortACS.value ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
  })
}

function paginate (pageNumber: number): void {
  page.value = pageNumber
  shownHomebrew.value = sortedHomebrew.value.slice(
    pageNumber * perPage.value,
    (pageNumber * perPage.value) + perPage.value
  )
}
</script>

<template>
  <section class="space-y-4">
    <div class="flex justify-between border-b border-slate-700 pb-1">
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
      <AddHomebrew />
    </div>
    <div
      v-if="store?.campaign?.homebrew_items?.length"
      class="inline-block rounded-lg overflow-x-auto overflow-y-hidden w-full"
    >
      <table class="min-w-full bg-tracker">
        <thead>
          <tr>
            <th
              v-for="header in ['name', 'type', 'health', 'ac', 'link', 'actions', 'modify']"
              :key="header"
              class="py-3 px-2 border-b border-r last:border-r-0 border-slate-700"
              :class="{
                'cursor-pointer': ['name', 'type', 'health', 'ac'].includes(header)
              }"
              @click="sortItems(header)"
            >
              <div class="flex gap-2 justify-center items-center">
                <p class="uppercase">
                  {{ header }}
                </p>
                <Icon
                  name="ph:arrows-down-up-bold"
                  class="w-5 h-5 cursor-pointer text-secondary/50"
                  :class="{
                    '!hidden': ['link', 'actions', 'modify'].includes(header),
                    '!text-secondary': sortedBy === header
                  }"
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in shownHomebrew"
            :key="item.id"
            class="border-b last:border-b-0 border-slate-700"
          >
            <td class="px-2 py-1 border-r border-slate-700 relative">
              {{ item.name }}
            </td>
            <td
              class="px-2 py-1 border-r border-slate-700"
            >
              <div class="flex gap-2 items-center">
                <Icon
                  :name="useHomebrewIcon(item.type)"
                  :class="useHomebrewColor(item.type)"
                  size="20"
                />
                <p>
                  {{ item.type || '' }}
                </p>
              </div>
            </td>
            <td class="px-2 py-1 border-r border-slate-700">
              {{ item.type === 'lair' ? '' : item.health || '' }}
            </td>
            <td class="px-2 py-1 border-r border-slate-700">
              {{ item.type === 'lair' ? '' : item.ac || '' }}
            </td>
            <td class="px-2 py-1 border-r border-slate-700">
              <div class="flex justify-center">
                <NuxtLink
                  v-if="item.link"
                  :to="item.link"
                  target="_blank"
                  rel="noreferrer noopener"
                  class="w-fit"
                >
                  <Icon
                    name="ph:link-simple-horizontal"
                    class="w-8 h-8 cursor-pointer text-info"
                  />
                </NuxtLink>
              </div>
            </td>
            <td class="px-2 py-1 border-r border-slate-700">
              <p class="text-slate-400 text-center">
                coming soon
              </p>
            </td>
            <td class="px-2 py-1">
              <div class="flex justify-center items-center gap-1">
                <UpdateHomebrew :item="item" class="relative bottom-[2px]" />
                <button
                  v-tippy="{ content: $t('actions.delete'), animation: 'shift-away' }"
                  @click="store.removeHomebrew(item.id)"
                >
                  <Icon
                    name="material-symbols:delete-outline-rounded"
                    class="w-6 h-6 text-danger outline-none"
                  />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <Pagination
        v-if="pages > 1"
        v-model="page"
        :total-pages="pages"
        @paginate="paginate"
      />
    </div>
    <div v-else class="grid md:grid-cols-2 gap-4 pt-6">
      <div class="flex flex-col justify-center gap-4">
        <h2 class="pb-2">
          {{ $t('components.homebrewTable.title') }}
        </h2>
        <p class="max-w-prose">
          {{ $t('components.homebrewTable.text') }}
        </p>
      </div>
      <NuxtImg
        src="/dragon_hoard.webp"
        alt="Dragon on hoard"
        sizes="sm:500px md:500px lg:500px"
        format="webp"
        provider="imagekit"
        class="mx-auto"
      />
    </div>
  </section>
</template>
