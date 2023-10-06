import logRocket from 'logrocket'

export const useEncountersStore = defineStore('useEncountersStore', () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const loading = ref<boolean>(true)
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
        .select('*, profiles(id, name, username, avatar), campaign(id, created_by(id), team(id, user(id), role), title, background, color)')

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
    if (!user.value) {
      return
    }

    let encounter: UpdateEncounter = {
      ...enc,
      title: `copy ${enc.title}`.slice(0, 30),
      created_by: user.value.id,
      campaign: undefined
    }

    if (enc.campaign) {
      encounter = {
        ...encounter,
        campaign: typeof enc.campaign === 'object' ? enc.campaign.id : enc.campaign as number
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
      fetch()
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
      fetch()
    }
  }

  async function updateEncounter (encounter: UpdateEncounter, id: number): Promise<Encounter> {
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
    copyEncounter,
    deleteEncounter,
    bulkDeleteEncounters,
    updateEncounter
  }
})
