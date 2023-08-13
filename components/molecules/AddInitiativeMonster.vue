<script setup>
import logRocket from 'logrocket'

const store = useTableStore()
const toast = useToastStore()
const open5e = useOpen5eStore()

const isOpen = ref(false)
const isLoading = ref(false)
const hits = ref([])
const page = ref(0)
const pages = ref(0)
const form = ref({ search: '', challenge_rating: null })

watchDebounced(
  form,
  (v) => {
    if (v) {
      fetchMonsters(useEmptyKeyRemover(form.value), page.value)
      page.value = 0
    } else {
      hits.value = []
    }
  },
  { debounce: 500, maxWait: 1000, deep: true }
)

async function fetchMonsters (query, page) {
  isLoading.value = true
  try {
    const { results, count } = await open5e.getData({
      query: { ...query, page: page + 1 },
      type: 'monsters'
    })
    pages.value = Math.ceil(count / 20)
    hits.value = results
  } catch (err) {
    logRocket.captureException(err)
    toast.error()
  } finally {
    isLoading.value = false
  }
}

function paginate (newPage) {
  page.value = newPage
  fetchMonsters(form.value, newPage)
  const el = document.getElementById('el')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }
}

async function addMonster (monster) {
  isLoading.value = true
  try {
    const row = useCreateRow(monster, 'monster', store.encounter.rows)
    await store.encounterUpdate({
      rows: [...store.encounter.rows, row]
    })
    reset()
  } catch (err) {
    logRocket.captureException(err)
    toast.error(err)
  } finally {
    isLoading.value = false
  }
}

function reset () {
  form.value = { search: '', challenge_rating: null }
  hits.value = []
  isOpen.value = false
}
</script>

<template>
  <section>
    <button
      v-tippy="{
        content: $t('components.addInitiativeMonster.manual'),
        touch: false
      }"
      :aria-label="$t('components.addInitiativeMonster.manual')"
      class="flex gap-2 items-center"
      @click="isOpen = true"
    >
      <span class="md:hidden">
        {{ $t('components.addInitiativeMonster.manual') }}
      </span>
      <Icon name="solar:book-bookmark-linear" class="text-info w-10 h-10" />
    </button>
    <Modal v-if="isOpen" big @close="reset">
      <h1 class="pb-4 text-center">
        {{ $t('components.addInitiativeMonster.manual') }}
      </h1>
      <div id="el" class="flex gap-6 items-end max-w-xl mx-auto">
        <div class="grow">
          <Input
            v-model="form.search"
            focus
            name="search"
            :label="$t('components.inputs.nameLabel')"
            validation="length:0,50"
            placeholder="Copper dragon"
          />
        </div>
        <div class="grow">
          <Input
            v-model="form.challenge_rating"
            name="challenge_rating"
            type="number"
            :label="$t('components.inputs.challengeLabel')"
            validation="number|between:0,30"
            min="0"
            max="30"
          />
        </div>
      </div>
      <div class="overflow-y-auto max-h-full space-y-2">
        <div v-if="isLoading" class="relative w-20 h-20 mx-auto">
          <div class="loader" />
        </div>
        <template v-else-if="hits.length">
          <MonsterCard
            v-for="hit in hits"
            :key="hit.id"
            :monster="hit"
            addable
            @add="addMonster"
          />
          <Pagination
            v-if="pages > 1"
            v-model="page"
            :total-pages="pages"
            @paginate="paginate"
          />
        </template>
        <p
          v-else-if="!isLoading && (form.search || form.challenge_rating)"
          class="text-center max-w-prose mx-auto"
        >
          {{ $t('components.addInitiativeMonster.notFound') }}
        </p>
      </div>
    </Modal>
  </section>
</template>
