import logRocket from 'logrocket'
import armor from '@/fixtures/armor.json'
import conditions from '@/fixtures/conditions.json'
import magicitems from '@/fixtures/magicitems.json'
import spells from '@/fixtures/spells.json'
import weapons from '@/fixtures/weapons.json'
import monsters from '@/fixtures/monsters.json'

export const useOpen5eStore = defineStore('useOpen5eStore', () => {
  const toast = useToastStore()

  const isLoading = ref<boolean>(false)
  const sortBy = ref<Open5eSortBy>('name')
  const hits = ref<Open5eItem[]>([])
  const page = ref<number>(0)
  const pages = ref<number>(0)
  const form = ref<Open5eSearch>({ search: '', cr: undefined })

  watchDebounced(() => sortBy.value, () => {
    page.value = 0
    fetchMonsters(form.value, page.value)
  }, { debounce: 500, maxWait: 1000 })

  watchDebounced(
    form,
    (v) => {
      if (v) {
        fetchMonsters(form.value, page.value)
        page.value = 0
      } else {
        hits.value = []
      }
    },
    { debounce: 500, maxWait: 1000, deep: true }
  )

  function getData (filters: Open5eFilters): Open5eResponse {
    let results: any[] = []

    switch (filters.type) {
      case 'armor':
        results = armor
        break
      case 'conditions':
        results = conditions
        break
      case 'magicitems':
        results = magicitems
        break
      case 'spells':
        results = spells
        break
      case 'weapons':
        results = weapons
        break
      default:
        results = monsters
        break
    }

    return {
      count: 20,
      previous: null,
      next: null,
      results: results as Open5eItem[]
    }
  }

  async function fetchMonsters (query: Open5eSearch, page: number): Promise<void> {
    isLoading.value = true
    try {
      const { results, count } = getData({
        query: { ...query, page: page + 1 },
        type: 'monsters'
      })
      pages.value = Math.ceil(count / 20)
      hits.value = results
    } catch (err) {
      logRocket.captureException(err as Error)
      toast.error()
    } finally {
      isLoading.value = false
    }
  }

  function paginate (newPage: number): void {
    page.value = newPage
    fetchMonsters(form.value, newPage)

    const el = document.getElementById('el')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }

  const options: Open5eType[] = [
    'spells',
    'conditions',
    'magicitems',
    'weapons',
    'armor',
    'sections'
  ]

  return {
    options,
    isLoading,
    hits,
    page,
    pages,
    sortBy,
    form,
    getData,
    fetchMonsters,
    paginate
  }
})
