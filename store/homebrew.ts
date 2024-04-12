import logRocket from 'logrocket'

export const useHomebrewStore = defineStore('useHomebrewStore', () => {
  const supabase = useSupabaseClient()
  const currentStore = useCurrentCampaignStore()
  const tableStore = useTableStore()
  const toast = useToastStore()

  const loading = ref<boolean>(true)
  const searching = ref<boolean>(true)
  const encounterModal = ref<boolean>(false)
  const error = ref<string | null>(null)
  const data = ref<Homebrew[]>([])
  const pages = ref<number>(0)
  const page = ref<number>(0)
  const perPage = ref<number>(20)
  const homebrewCount = ref<number>(0)
  const max = ref<number>(100)

  const filters = ref<TableFilters>({
    search: '',
    sortedBy: 'name',
    sortACS: true
  })

  const noItems = computed<boolean>(() => data.value.length === 0 && !loading.value)

  watchDebounced(() => filters.value, async () => {
    let campaignId
    page.value = 0

    if (encounterModal.value && tableStore.encounter?.campaign?.id) {
      campaignId = tableStore.encounter.campaign.id
    } else if (currentStore.campaign?.id) {
      campaignId = currentStore.campaign.id
    }

    if (campaignId) {
      await fetch({ field: 'campaign', value: campaignId }, true)
    }
  }, { debounce: 100, maxWait: 500, deep: true })

  async function fetch (eq?: SupabaseEq, fuzzy: boolean = false): Promise<void> {
    error.value = null
    fuzzy ? searching.value = true : loading.value = true

    try {
      const { from, to } = generateRange(page.value, perPage.value)

      let query = supabase
        .from('homebrew_items')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order(filters.value.sortedBy, { ascending: filters.value.sortACS })

      if (eq) {
        query = query.eq(eq.field, eq.value)
      }

      if (filters.value.search && fuzzy) {
        query = query.ilike('name', `%${filters.value.search}%`)
      }

      const { data: homebrew, error: err, count } = await query

      pages.value = calcPages((count || 1), perPage.value)

      if (fuzzy) {
        await getCount()
      }

      if (err) {
        throw err
      }
      if (homebrew) {
        data.value = homebrew
      }
    } catch (err) {
      logRocket.captureException(err as Error)
      error.value = err as string
    } finally {
      loading.value = false
      searching.value = false
    }
  }

  async function getCount (): Promise<void> {
    if (currentStore.campaign === null) { return }

    const { count } = await supabase
      .from('homebrew_items')
      .select('id', { count: 'exact' })
      .eq('campaign', currentStore.campaign.id)
      .limit(1)

    homebrewCount.value = count || 0
  }

  async function paginate (newPage: number, eq?: SupabaseEq): Promise<void> {
    page.value = newPage
    await fetch(eq, true)
  }

  async function getHomebrewById (id: number): Promise<Homebrew> {
    const { data, error } = await supabase.from('homebrew_items')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    return data
  }

  async function getHomebrewByType (type: RowType): Promise<Homebrew[]> {
    const { data, error } = await supabase.from('homebrew_items')
      .select('*')
      .eq('type', type)

    if (error) {
      throw error
    }

    return data
  }

  async function addHomebrew (homebrew: AddHomebrew): Promise<void> {
    try {
      const { data: newHomebrew, error } = await supabase.from('homebrew_items')
        .insert([homebrew as never])
        .select('*')

      if (error) {
        throw error
      } else if (newHomebrew.length) {
        data.value = [newHomebrew[0] as Homebrew, ...data.value]
        homebrewCount.value++
      }
    } catch (err) {
      logRocket.captureException(err as Error)
      toast.error()
    }
  }

  async function deleteHomebrew (id: number|number[]): Promise<void> {
    try {
      let query = supabase.from('homebrew_items').delete()

      query = Array.isArray(id)
        ? query.in('id', id)
        : query.eq('id', id)

      const { error } = await query

      if (error) {
        throw error
      } else {
        fetch({ field: 'campaign', value: currentStore.campaign!.id }, !!filters.value.search)
      }
    } catch (err) {
      logRocket.captureException(err as Error)
      toast.error()
    }
  }

  async function updateHomebrew (homebrew: UpdateHomebrew, id: number): Promise<void> {
    try {
      const { data: updatedHomebrew, error } = await supabase.from('homebrew_items')
        .update(homebrew as never)
        .eq('id', id)
        .select('*')

      if (error) {
        throw error
      } else if (updatedHomebrew.length) {
        const index = data.value.findIndex(e => e.id === id)
        data.value[index] = {
          ...data.value[index],
          ...updatedHomebrew[0] as Homebrew
        }
      }
    } catch (err) {
      logRocket.captureException(err as Error)
      toast.error()
    }
  }

  function reset (): void {
    homebrewCount.value = 0
    data.value = []
    error.value = null
    encounterModal.value = false

    resetPagination()
  }

  function resetPagination (): void {
    pages.value = 0
    page.value = 0
    filters.value = {
      search: '',
      sortedBy: 'id',
      sortACS: true
    }
  }

  return {
    loading,
    searching,
    encounterModal,
    error,
    data,
    max,
    pages,
    page,
    perPage,
    filters,
    homebrewCount,
    noItems,
    fetch,
    paginate,
    getHomebrewById,
    getHomebrewByType,
    addHomebrew,
    updateHomebrew,
    deleteHomebrew,
    resetPagination,
    reset,
    sandbox: [
      { type: 'player', id: 1, name: 'Carlo', health: '37', ac: '13', created_at: 'now', campaign: 1 },
      { type: 'player', id: 2, name: 'Silvin', health: '33', ac: '14', created_at: 'now', campaign: 1 },
      { type: 'player', id: 3, name: 'Alexis', health: '29', ac: '12', created_at: 'now', campaign: 1 },
      { type: 'player', id: 4, name: 'Thernus', health: '31', ac: '16', created_at: 'now', campaign: 1 },
      { type: 'player', id: 5, name: 'Banthaaja', health: '30', ac: '15', created_at: 'now', campaign: 1 },
      { type: 'monster', id: 6, name: 'Lulu', health: '69', ac: '20', created_at: 'now', campaign: 1 },
      { type: 'monster', id: 7, name: 'Pony', health: '33', ac: '10', created_at: 'now', campaign: 1 },
      { type: 'npc', id: 8, name: 'Rocky', health: '24', ac: '16', created_at: 'now', campaign: 1 },
      { type: 'npc', id: 9, name: 'Gray', health: '20', ac: '16', created_at: 'now', campaign: 1 },
      { type: 'npc', id: 10, name: 'Ginger', health: '10', ac: '18', created_at: 'now', campaign: 1 },
      { type: 'summon', id: 11, name: 'Inli', health: '18', ac: '12', created_at: 'now', campaign: 1 },
      { type: 'lair', id: 12, name: 'Lair action', created_at: 'now', campaign: 1 }
    ] as Homebrew[]
  }
})
