import logRocket from 'logrocket'

export const useEncountersStore = defineStore('useEncountersStore', () => {
  const supabase = useSupabaseClient()
  const profile = useProfileStore()
  const { copy } = useClipboard()
  const toast = useToastStore()
  const { t, locale } = useI18n()

  const loading = ref<boolean>(true)
  const searching = ref<boolean>(true)
  const error = ref<string | null>(null)
  const data = ref<Encounter[]>([])
  const pages = ref<number>(0)
  const page = ref<number>(0)
  const perPage = ref<number>(20)
  const encounterCount = ref<number>(0)

  const filters = ref<TableFilters>({
    search: '',
    sortedBy: 'title',
    sortACS: true
  })

  const max = computed<number>(() => getMax('encounter', profile.data?.subscription_type || 'free'))

  const select = `
    *, 
    profiles(id, name, username, avatar), 
    campaign( 
      id, title, background, color,
      created_by(id), 
      team(id, user(id), role)
    )
  `

  const restrictionEncounters = computed<Encounter[]>(() => {
    if (!profile.data) { return [] }
    const { userArr, nonUserArr } = sortEncountersByUserCreated(data.value, profile.data.id)

    return [...userArr.splice(0, max.value), ...nonUserArr]
  })

  const noItems = computed<boolean>(() => restrictionEncounters.value.length === 0 && !loading.value)

  async function fetch (eq?: SbEq, fuzzy: boolean = false): Promise<void> {
    error.value = null
    fuzzy ? searching.value = true : loading.value = true

    try {
      const { data: sheets, pagesCount } = await sbQuery<Encounter>({
        table: 'initiative_sheets',
        page: page.value,
        perPage: perPage.value,
        filters: filters.value,
        select,
        eq,
        fuzzy
      })

      if (sheets) { data.value = sheets }

      pages.value = pagesCount

      getCount()
    } catch (err) {
      logRocket.captureException(err as Error)
      error.value = err as string
    } finally {
      loading.value = false
      searching.value = false
    }
  }

  async function getCount (): Promise<void> {
    const { count } = await supabase
      .from('initiative_sheets')
      .select('id', { count: 'exact' })
      .limit(1)

    encounterCount.value = count || 0
  }

  async function paginate (newPage: number, eq?: SbEq): Promise<void> {
    page.value = newPage
    await fetch(eq, true)
  }

  async function getEncountersByCampaign (id: number): Promise<Encounter[]> {
    const { data: sheets, error: err } = await supabase
      .from('initiative_sheets')
      .select(select)
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
      .select(select)

    if (err) {
      throw err
    } else {
      data.value = data.value && data.value.length
        ? [sheets[0] as Encounter, ...data.value]
        : [sheets[0]]

      encounterCount.value++

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

  async function deleteEncounter (id: number|number[], campaign?: number): Promise<void> {
    try {
      let query = supabase.from('initiative_sheets').delete()

      query = Array.isArray(id)
        ? query.in('id', id)
        : query.eq('id', id)

      const { error: err } = await query

      if (err) {
        throw err
      } else {
        fetch(
          campaign ? { field: 'campaign', value: campaign } : undefined,
          true
        )
      }
    } catch (err) {
      logRocket.captureException(err as Error)
      toast.error()
    }
  }

  async function updateEncounter (
    encounter: UpdateEncounter,
    id: number,
    campaignView: boolean = false
  ): Promise<Encounter> {
    const { data: sheets, error: err } = await supabase
      .from('initiative_sheets')
      .update(encounter as never)
      .eq('id', id)
      .select(select)

    if (err) {
      throw err
    } else {
      fetch(
        campaignView && encounter.campaign ? { field: 'campaign', value: encounter.campaign } : undefined,
        true
      )
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
    filters.value = {
      search: '',
      sortedBy: 'id',
      sortACS: true
    }
  }

  return {
    loading,
    searching,
    error,
    data,
    restrictionEncounters,
    max,
    pages,
    page,
    perPage,
    filters,
    encounterCount,
    noItems,
    fetch,
    paginate,
    getEncountersByCampaign,
    addEncounter,
    copyEncounter,
    deleteEncounter,
    updateEncounter,
    shareEncounter,
    resetPagination
  }
})
