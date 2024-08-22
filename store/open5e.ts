import logRocket from 'logrocket'

export const useOpen5eStore = defineStore('useOpen5eStore', () => {
  const toast = useToastStore()
  const { t } = useI18n()

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
      }
      else {
        hits.value = []
      }
    },
    { debounce: 500, maxWait: 1000, deep: true },
  )

  async function getData(filters: Open5eFilters): Promise<Open5eResponse> {
    let url = `https://api.open5e.com/${filters.type ? filters.type + '/' : ''}?limit=${filters.limit || '20'}&ordering=${filters.type === 'monsters' ? sortBy.value : 'name'}&document__slug=wotc-srd`

    const query = removeEmptyKeys<Open5eQuery>(filters.query as Open5eQuery)

    if (query) {
      Object.keys(query).forEach((key: string) => {
        url += `&${key}=${query![key as keyof Open5eQuery]}`
      })
    }

    return await $fetch(url)
  }

  async function fetchMonsters(query: Open5eSearch, page: number): Promise<void> {
    isLoading.value = true
    try {
      const { results, count } = await getData({
        query: { ...query, page: page + 1 },
        type: 'monsters',
      })
      pages.value = Math.ceil(count / 20)
      hits.value = results
    }
    catch (err) {
      logRocket.captureException(err as Error)
      toast.error()
    }
    finally {
      isLoading.value = false
    }
  }

  function paginate(newPage: number): void {
    page.value = newPage
    fetchMonsters(form.value, newPage)

    const el = document.getElementById('el')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }

  const options: Option<Open5eType>[] = [
    { value: 'spells', label: t('general.spells') },
    { value: 'conditions', label: t('general.conditions') },
    { value: 'magicitems', label: t('general.magicitems') },
    { value: 'weapons', label: t('general.weapons') },
    { value: 'armor', label: t('general.armor') },
    { value: 'sections', label: t('general.sections') },
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
    paginate,
  }
})
