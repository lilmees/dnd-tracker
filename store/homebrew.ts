import logRocket from 'logrocket'

export const useHomebrewStore = defineStore('useHomebrewStore', () => {
  const supabase = useSupabaseClient()
  const currentStore = useCurrentCampaignStore()

  const loading = ref<boolean>(true)
  const error = ref<string | null>(null)
  const data = ref<Homebrew[]>([])
  const pages = ref<number>(0)
  const page = ref<number>(0)
  const perPage = ref<number>(20)
  const homebrewCount = ref<number>(0)
  const homebrewCountLocal = ref<number>(0)
  const max = ref<number>(100)

  const filters = ref<TableFilters>({
    search: '',
    sortedBy: 'id',
    sortACS: true
  })

  const noItems = computed<boolean>(() => data.value.length === 0 && !loading.value)

  watchDebounced(() => filters.value, async (v) => {
    page.value = 0
    if (currentStore.campaign) {
      await fetch({ field: 'campaign', value: currentStore.campaign.id }, true)
    }
  }, { debounce: 100, maxWait: 500, deep: true })

  async function fetch (eq?: SupabaseEq, fuzzy: boolean = false): Promise<void> {
    error.value = null

    if (!fuzzy) { loading.value = true }

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
      homebrewCountLocal.value = count || 0

      await getCount()

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
    }
  }

  async function getCount (): Promise<void> {
    const { count } = await supabase
      .from('homebrew_items')
      .select('id', { count: 'exact' })
      .limit(1)

    homebrewCount.value = count || 0
  }

  async function paginate (newPage: number, eq?: SupabaseEq): Promise<void> {
    page.value = newPage
    await fetch(eq, true)
  }

  async function getHomebrewByCampaignId (id: number): Promise<Homebrew[]> {
    const { data, error } = await supabase.from('homebrew_items')
      .select('*')
      .eq('campaign', id)

    if (error) {
      throw error
    }

    return data
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

  async function addHomebrew (homebrew: AddHomebrew): Promise<Homebrew> {
    const { data, error } = await supabase.from('homebrew_items')
      .insert([homebrew as never])
      .select('*')

    if (error) {
      throw error
    } else {
      return data[0] as Homebrew
    }
  }

  async function deleteHomebrew (id: number): Promise<void> {
    const { error } = await supabase.from('homebrew_items')
      .delete()
      .eq('id', id)
      .select('*')

    if (error) {
      throw error
    } else {
      fetch(undefined, !!filters.value.search)
    }
  }

  async function bulkDeleteHomebrew (ids: number[]): Promise<void> {
    const { error: err } = await supabase
      .from('initiative_sheets')
      .delete()
      .in('id', ids)
      .select('*')

    if (err) {
      throw err
    } else {
      fetch(undefined, !!filters.value.search)
    }
  }

  async function updateHomebrew (homebrew: UpdateHomebrew, id: number): Promise<Homebrew> {
    const { data, error } = await supabase.from('homebrew_items')
      .update(homebrew as never)
      .eq('id', id)
      .select('*')

    if (error) {
      throw error
    }

    return data[0]
  }

  function resetPagination (): void {
    pages.value = 0
    page.value = 0
    homebrewCountLocal.value = 0
    filters.value = {
      search: '',
      sortedBy: 'id',
      sortACS: true
    }
  }

  return {
    loading,
    error,
    data,
    max,
    pages,
    page,
    perPage,
    filters,
    homebrewCount,
    homebrewCountLocal,
    noItems,
    fetch,
    paginate,
    getHomebrewByCampaignId,
    getHomebrewById,
    getHomebrewByType,
    addHomebrew,
    updateHomebrew,
    deleteHomebrew,
    bulkDeleteHomebrew,
    resetPagination,
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
