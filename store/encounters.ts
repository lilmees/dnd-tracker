import logRocket from 'logrocket'

export const useEncountersStore = defineStore('useEncountersStore', () => {
  const supabase = useSupabaseClient()
  const profile = useProfileStore()
  const { copy } = useClipboard()
  const toast = useToastStore()
  const { t, locale } = useI18n()

  const loading = ref<boolean>(true)
  const error = ref<string | null>(null)
  const data = ref<Encounter[]>([])
  const pages = ref<number>(0)
  const page = ref<number>(0)
  const perPage = ref<number>(20)
  const encounterCount = ref<number>(0)
  const encounterCountLocal = ref<number>(0)

  const filters = ref<TableFilters>({
    search: '',
    sortedBy: 'id',
    sortACS: true
  })

  const max = computed<number>(() => getMax('encounter', profile.data?.subscription_type || 'free'))

  const restrictionEncounters = computed<Encounter[]>(() => {
    if (!profile.data) { return [] }
    const { userArr, nonUserArr } = sortEncountersByUserCreated(data.value, profile.data.id)

    return [...userArr.splice(0, max.value), ...nonUserArr]
  })

  const noItems = computed<boolean>(() => restrictionEncounters.value.length === 0 && !loading.value)

  async function fetch (eq?: SupabaseEq): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const { from, to } = generateRange(page.value, perPage.value)

      let query = supabase
        .from('initiative_sheets')
        .select(
          '*, profiles(id, name, username, avatar), campaign(id, created_by(id), team(id, user(id), role), title, background, color)',
          { count: 'exact' }
        )
        .range(from, to)
        .order(filters.value.sortedBy, { ascending: filters.value.sortACS })

      if (eq) {
        query = query.eq(eq.field, eq.value)
      }

      const { data: sheets, error: err, count } = await query

      pages.value = calcPages((count || 1), perPage.value)
      encounterCountLocal.value = count || 0

      await getCount()

      if (err) {
        throw err
      }
      if (sheets) {
        data.value = sheets
      }
    } catch (err) {
      logRocket.captureException(err as Error)
      error.value = err as string
    } finally {
      loading.value = false
    }
  }

  async function fuzzySearchEncounters (eq?: SupabaseEq): Promise<void> {
    error.value = null

    try {
      const { from, to } = generateRange(page.value, perPage.value)

      let query = supabase
        .from('initiative_sheets')
        .select(
          '*, profiles(id, name, username, avatar), campaign(id, created_by(id), team(id, user(id), role), title, background, color)',
          { count: 'exact' }
        )
        .range(from, to)
        .order(filters.value.sortedBy, { ascending: filters.value.sortACS })

      if (eq) {
        query = query.eq(eq.field, eq.value)
      }

      if (filters.value.search) {
        query = query.ilike('title', `%${filters.value}%`)
      }

      const { data: sheets, error: err, count } = await query

      pages.value = calcPages((count || 1), perPage.value)
      encounterCountLocal.value = count || 0

      await getCount()

      if (err) {
        throw err
      }
      if (sheets) {
        data.value = sheets
      }
    } catch (err) {
      logRocket.captureException(err as Error)
      error.value = err as string
    }
  }

  async function getCount (): Promise<void> {
    const { count } = await supabase
      .from('initiative_sheets')
      .select('id', { count: 'exact' })
      .limit(1)

    encounterCount.value = count || 0
  }

  async function paginate (newPage: number, eq?: SupabaseEq): Promise<void> {
    page.value = newPage
    await fuzzySearchEncounters(eq)
  }

  async function getEncountersByCampaign (id: number): Promise<Encounter[]> {
    const { data: sheets, error: err } = await supabase
      .from('initiative_sheets')
      .select('*, profiles(id, name, username, avatar), campaign(id, created_by(id), team(id, user(id), role), title, background, color)')
      .eq('campaign', `${id}`)

    if (err) {
      throw err
    } else {
      return sheets
    }
  }

  async function addEncounter (encounter: AddEncounter): Promise<Encounter> {
    const { data: sheets, error: err } = await supabase
      .from('initiative_sheets')
      .insert([encounter as never])
      .select('*, profiles(id, name, username, avatar), campaign(id, created_by(id), team(id, user(id), role), title, background, color)')

    if (err) {
      throw err
    } else {
      data.value && data.value.length
        ? data.value.push(sheets[0])
        : (data.value = [sheets[0]])

      return sheets[0]
    }
  }

  async function copyEncounter ({ created_at, id, profiles, ...enc }: Encounter): Promise<Encounter|undefined> {
    if (!profile.data) {
      return
    }

    let encounter: UpdateEncounter = {
      ...enc,
      title: `copy ${enc.title}`.slice(0, 30),
      created_by: profile.data.id,
      campaign: undefined
    }

    if (enc.campaign) {
      encounter = {
        ...encounter,
        campaign: enc.campaign.id
      }
    }

    return await addEncounter(encounter as AddEncounter)
  }

  async function deleteEncounter (id: number): Promise<void> {
    const { error: err } = await supabase
      .from('initiative_sheets')
      .delete()
      .eq('id', id)
      .select('*')

    if (err) {
      throw err
    } else {
      filters.value.search ? fuzzySearchEncounters() : fetch()
    }
  }

  async function bulkDeleteEncounters (ids: number[]): Promise<void> {
    const { error: err } = await supabase
      .from('initiative_sheets')
      .delete()
      .in('id', ids)
      .select('*')

    if (err) {
      throw err
    } else {
      filters.value.search ? fuzzySearchEncounters() : fetch()
    }
  }

  async function updateEncounter (encounter: UpdateEncounter, id: number): Promise<Encounter> {
    const { data: sheets, error: err } = await supabase
      .from('initiative_sheets')
      .update(encounter as never)
      .eq('id', id)
      .select('*, profiles(id, name, username, avatar), campaign(id, created_by(id), team(id, user(id), role), title, background, color)')

    if (err) {
      throw err
    } else {
      if (data.value) {
        data.value = data.value.filter(e => e.id !== id)
        data.value.push(sheets[0])
      } else {
        data.value = [sheets[0]]
      }
      return sheets[0]
    }
  }

  function shareEncounter (encounter: Encounter): void {
    try {
      const content = window.btoa(encodeURIComponent(encounter.id))
      const url = `https://dnd-tracker.com${locale.value === 'en' ? '/en/' : '/'}playground?content=${content}`

      copy(url)

      toast.info({
        title: t('actions.copyClipboard'),
        timeout: 2000
      })
    } catch (err) {
      toast.error()
    }
  }

  function resetPagination (): void {
    pages.value = 0
    page.value = 0
    encounterCountLocal.value = 0
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
    restrictionEncounters,
    max,
    pages,
    page,
    perPage,
    filters,
    encounterCount,
    encounterCountLocal,
    noItems,
    fetch,
    fuzzySearchEncounters,
    paginate,
    getEncountersByCampaign,
    addEncounter,
    copyEncounter,
    deleteEncounter,
    bulkDeleteEncounters,
    updateEncounter,
    shareEncounter,
    resetPagination
  }
})
