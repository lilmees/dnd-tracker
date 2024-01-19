<script setup lang="ts">
import logRocket from 'logrocket'

const open5e = useOpen5eStore()
const toast = useToastStore()

interface Form { search: string, type: Open5eType }

const form = ref<Form>({ search: '', type: 'spells' })
const isLoading = ref<boolean>(false)
const hits = ref<InfoCard[]>([])
const page = ref<number>(0)
const pages = ref<number>(0)

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

onMounted(() => fetchInfo(form.value))

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

  const el = document.getElementById('el')

  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }
}
</script>

<template>
  <Layout shadow>
    <div class="flex flex-col py-6 gap-10 max-h-full">
      <div class="flex items-start gap-4 max-w-prose w-full mx-auto p-6 rounded-lg border-tracker bg-tracker/50">
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
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 items-start gap-4 overflow-y-auto">
        <template v-if="isLoading">
          <SkeletonInfoCard v-for="i in 20" :key="i" />
        </template>
        <template v-else-if="hits.length">
          <InfoCard
            v-for="(hit, index) in hits"
            :id="index === 0 ? 'el' : ''"
            :key="hit.slug"
            :type="form.type"
            :hit="hit"
            sandbox
            gray
          />
        </template>
      </div>
      <Pagination
        v-if="pages > 1 && !isLoading && hits.length"
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
  </Layout>
</template>
