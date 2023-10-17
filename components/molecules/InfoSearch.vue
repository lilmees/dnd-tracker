<script setup lang="ts">
import logRocket from 'logrocket'

const open5e = useOpen5eStore()
const toast = useToastStore()
const table = useTableStore()
const { t } = useI18n()

interface Form { search: string, type: Open5eType}

const form = ref<Form>({ search: '', type: 'spells' })
const isLoading = ref<boolean>(false)
const isOpen = ref<boolean>(false)
const showPinned = ref<boolean>(false)
const hits = ref<InfoCard[]>([])
const page = ref<number>(0)
const pages = ref<number>(0)

whenever(() => isOpen.value, () => {
  if (!hits.value.length) {
    fetchInfo(form.value)
  }
})

watch(
  form,
  (v: Form) => {
    if (v) {
      page.value = 0
      fetchInfo(form.value)
    } else {
      form.value.search = ''
      hits.value = []
      isLoading.value = false
    }
  }, { deep: true }
)

const fetchInfo = useDebounceFn(async (query: Form): Promise<void> => {
  isLoading.value = true

  try {
    const { results, count } = await open5e.getData({
      query: { search: query.search, page: page.value + 1 },
      type: query.type
    })
    pages.value = Math.ceil(count / 20)

    hits.value = results
  } catch (err) {
    logRocket.captureException(err as Error)
    toast.error()
  } finally {
    isLoading.value = false
  }
}, 500, { maxWait: 1000 })

function paginate (newPage: number): void {
  page.value = newPage
  fetchInfo(form.value)
  scrollToTop()
}

function reset (): void {
  form.value = { search: '', type: 'spells' }
  hits.value = []
  isOpen.value = false
}

async function handlePinToggle (data: { info: InfoCard, remove: boolean }): Promise<void> {
  if (!table.encounter) {
    return
  }

  let update = table.encounter.info_cards

  if (data.remove) {
    update = update.filter((i: InfoCard) => i.slug !== data.info.slug)
  } else if (table.encounter.info_cards.length >= 10) {
    toast.error({
      title: t('components.infoSearch.toast.maxTitle'),
      text: t('components.infoSearch.toast.maxText')
    })
  } else {
    update.push(data.info)
  }

  await table.encounterUpdate({ info_cards: update })
}

function showToggle (): void {
  showPinned.value = !showPinned.value
  scrollToTop()
}

async function removePins (): Promise<void> {
  await table.encounterUpdate({ info_cards: [] })
  showPinned.value = false
  scrollToTop()
}

function scrollToTop (): void {
  const el = document.getElementById('el')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }
}
</script>

<template>
  <section>
    <button
      v-tippy="{
        content: $t('components.fullScreenSearch.tooltip'),
        touch: false
      }"
      :aria-label="$t('components.fullScreenSearch.tooltip')"
      class="flex gap-2 items-center disabled:opacity-40 disabled:cursor-not-allowed"
      @click="isOpen = true"
    >
      <span class="md:hidden">
        {{ $t('components.fullScreenSearch.tooltip') }}
      </span>
      <Icon
        name="material-symbols:search"
        class="text-success w-10 h-10"
        aria-hidden="true"
      />
    </button>
    <FullScreenSearch :open="isOpen" @close="reset">
      <div class="flex flex-col max-h-screen py-6">
        <div class="space-y-2">
          <div
            class="flex items-start gap-4 max-w-prose w-full mx-auto"
            :class="{ 'pb-10': !table.encounter?.info_cards?.length || false }"
          >
            <FormKit
              v-model="form.search"
              type="search"
              :label="$t('components.inputs.nameLabel')"
              outer-class="$reset !pb-0 grow"
            />
            <FormKit
              v-model="form.type"
              type="select"
              :label="$t('components.inputs.typeLabel')"
              :options="open5e.options"
              outer-class="$reset !pb-0 grow"
              @input="form.search = ''"
            />
          </div>
          <div
            v-if="table.encounter?.info_cards?.length"
            class="flex gap-4 pt-2 pb-8 w-full max-w-prose mx-auto"
          >
            <button class="btn-primary" @click="showToggle">
              {{ $t(`components.infoSearch.${ showPinned ? 'hide' : 'show' }`) }}
            </button>
            <button class="btn-danger" @click="removePins">
              {{ $t('components.infoSearch.remove') }}
            </button>
          </div>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 items-start gap-4 overflow-y-auto">
          <template v-if="isLoading">
            <SkeletonInfoCard v-for="i in 20" :key="i" />
          </template>
          <template v-else-if="hits.length || showPinned">
            <InfoCard
              v-for="(hit, index) in showPinned ? table.encounter?.info_cards : hits"
              :id="index === 0 ? 'el' : ''"
              :key="hit.slug"
              :hit="hit"
              :sandbox="table.isSandbox"
              :type="form.type"
              :pinned="table.encounter?.info_cards?.some(info => info.slug === hit.slug) || false"
              @pin="handlePinToggle"
            />
          </template>
        </div>
        <Pagination
          v-if="pages > 1 && !isLoading && hits.length && !showPinned"
          v-model="page"
          :total-pages="pages"
          class="mt-2"
          @paginate="paginate"
        />
        <p
          v-if="!isLoading && !hits.length && form.search !== ''"
          class="text-center max-w-prose mx-auto"
        >
          {{ $t('components.fullScreenSearch.notFound') }}
        </p>
      </div>
    </FullScreenSearch>
  </section>
</template>
