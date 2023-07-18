export const useEncountersStore = defineStore('useEncountersStore', () => {
  const supabase = useSupabaseClient()
  const { $logRocket } = useNuxtApp()

  const logRocket: any = $logRocket

  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const data = ref<Encounter[]>([])

  const sortedEncounters = computed<{ [key: string]: Encounter[] } | null>(() => data.value
    ? useEncountersByTeam(data.value)
    : null
  )

  async function fetch (): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const { data: sheets, error: err } = await supabase
        .from('initiative_sheets')
        .select('*, profiles(id, name, username, avatar),campaign(id, title, background, color)')

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

  async function getEncountersByCampaign (id: number): Promise<Encounter[]> {
    const { data: sheets, error: err } = await supabase
      .from('initiative_sheets')
      .select('*, profiles(id, name, username, avatar)')
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
      .select('*')

    if (err) {
      throw err
    } else {
      data.value && data.value.length
        ? data.value.push(sheets[0])
        : (data.value = [sheets[0]])

      return sheets[0]
    }
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
      fetch()
    }
  }

  async function updateEncounter (encounter: EncounterUpdate, id: number): Promise<Encounter> {
    const { data: sheets, error: err } = await supabase
      .from('initiative_sheets')
      .update(encounter as never)
      .eq('id', id)
      .select('*')

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

  return {
    loading,
    error,
    data,
    sortedEncounters,
    fetch,
    getEncountersByCampaign,
    addEncounter,
    deleteEncounter,
    updateEncounter
  }
})
