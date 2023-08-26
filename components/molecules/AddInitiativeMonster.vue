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
  console.log(query)
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
        content: $t('components.addInitiativeMonster.bestiary'),
        touch: false
      }"
      :aria-label="$t('components.addInitiativeMonster.bestiary')"
      class="flex gap-2 items-center"
      @click="isOpen = true"
    >
      <span class="md:hidden">
        {{ $t('components.addInitiativeMonster.bestiary') }}
      </span>
      <Icon name="la:dragon" class="text-info w-10 h-10" />
    </button>
    <FullScreenSearch v-if="isOpen" @close="reset">
      <div class="flex flex-col max-h-screen pt-20 pb-6">
        <h1 class="pb-4 text-center">
          {{ $t('components.addInitiativeMonster.bestiary') }}
        </h1>
        <div id="el" class="flex items-start gap-4 px-1">
          <FormKit
            v-model="form.search"
            type="search"
            name="search"
            :label="$t('components.inputs.nameLabel')"
            validation="length:0,50"
            placeholder="Copper dragon"
            outer-class="grow"
          />
          <FormKit
            v-model="form.challenge_rating"
            name="challenge_rating"
            type="number"
            :label="$t('components.inputs.challengeLabel')"
            validation="number|between:0,30"
            min="0"
            max="30"
            outer-class="grow"
          />
        </div>
        <div class="overflow-y-auto max-h-full">
          <div v-if="isLoading" class="relative w-20 h-20 mx-auto">
            <div class="loader" />
          </div>
          <template v-else-if="hits.length">
            <div class="grid lg:grid-cols-2 gap-4 items-start">
              <MonsterCard
                v-for="hit in hits"
                :key="hit.id"
                :monster="hit"
                addable
                @add="addMonster"
              />
            </div>
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
      </div>
    </FullScreenSearch>
  </section>
</template>
