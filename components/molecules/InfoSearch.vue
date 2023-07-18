<script setup lang="ts">
const open5e = useOpen5eStore()
const toast = useToastStore()
const { $logRocket } = useNuxtApp()

interface Form { search: string, type: Open5eType}

const form = ref<Form>({ search: '', type: 'spells' })
const isLoading = ref<boolean>(false)
const isOpen = ref<boolean>(false)
const isInit = ref<boolean>(true)
const hits = ref<any[]>([])
const page = ref<number>(0)
const pages = ref<number>(0)

watchOnce(() => isOpen.value, (v: boolean) => {
  if (v) {
    isLoading.value = true
    isInit.value = false
    fetchInfo(form.value)
  }
})

watch(
  form,
  (v: Form) => {
    if (v) {
      isLoading.value = true
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
  try {
    const { results, count } = await open5e.getData({
      query: { search: query.search, page: page.value + 1 },
      type: query.type
    })
    pages.value = Math.ceil(count / 20)

    // Filter out objects with the same name
    const unique: any[] = results.reduce((arr: any[], r: any) => {
      return !arr.find(item => item.name === r.name)
        ? arr.concat(r)
        : arr
    }, [])

    hits.value = unique
  } catch (err) {
    $logRocket.captureException(err)
    toast.error()
  } finally {
    isLoading.value = false
  }
}, 500, { maxWait: 1000 })

function paginate (newPage: number): void {
  isLoading.value = true
  page.value = newPage
  fetchInfo(form.value)
  const el = document.getElementById('el')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }
}

function reset (): void {
  form.value = { search: '', type: 'spells' }
  hits.value = []
  isOpen.value = false
}
</script>

<template>
  <section>
    <button
      v-tippy="{
        content: $t('components.fullScreenSearch.tooltip'),
        animation: 'shift-away',
        touch: false
      }"
      :aria-label="$t('components.fullScreenSearch.tooltip')"
      class="flex gap-2 items-center disabled:opacity-40 disabled:cursor-not-allowed"
      @click="isOpen = true"
    >
      <span class="md:hidden">
        {{ $t('components.fullScreenSearch.tooltip') }}
      </span>
      <Icon name="material-symbols:search" class="text-success w-10 h-10" />
    </button>
    <FullScreenSearch v-if="isOpen" @close="reset">
      <div class="flex flex-col max-h-screen max-w-prose mx-auto pt-20 pb-6">
        <div class="flex items-end gap-4 px-1 pb-10">
          <FormKit
            v-model="form.type"
            type="select"
            :label="$t('components.inputs.typeLabel')"
            :options="open5e.options"
            @input="form.search = ''"
          />
          <div class="grow">
            <FormKit
              v-model="form.search"
              type="text"
              :label="$t('components.inputs.nameLabel')"
            />
          </div>
          <button
            v-if="form.search"
            class="btn-primary mb-2"
            @click="form.search = ''"
          >
            <Icon name="ic:round-clear" size="25" />
          </button>
        </div>
        <div v-if="isLoading" class="relative w-20 h-20 mx-auto">
          <div class="loader" />
        </div>
        <div
          v-else-if="!isLoading && hits.length"
          class="flex flex-col gap-4 overflow-y-auto"
        >
          <InfoCard
            v-for="(hit, index) in hits"
            :id="index === 0 ? 'el' : ''"
            :key="hit.id"
            :hit="hit"
            :type="form.type"
          />
        </div>
        <Pagination
          v-if="pages > 1 && !isLoading && hits.length"
          v-model="page"
          :total-pages="pages"
          class="mt-2"
          @paginate="paginate"
        />
        <p
          v-if="!isLoading && !hits.length && !isInit && form.search !== ''"
          class="text-center max-w-prose mx-auto p-4 sm:p-8 bg-tracker rounded-lg"
        >
          {{ $t('components.fullScreenSearch.notFound') }}
        </p>
      </div>
    </FullScreenSearch>
  </section>
</template>
