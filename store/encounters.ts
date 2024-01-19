import logRocket from 'logrocket'
import { sortEncountersByCampaign, sortEncountersByUserCreated } from '@/utils/sort'
import { getMax } from '@/utils/subscription-helpers'

export const useEncountersStore = defineStore('useEncountersStore', () => {
  const supabase = useSupabaseClient()
  const profile = useProfileStore()
  const { copy } = useClipboard()
  const toast = useToastStore()
  const { t, locale } = useI18n()

  const loading = ref<boolean>(true)
  const error = ref<string | null>(null)
  const data = ref<Encounter[]>([])

  const max = computed<number>(() => getMax('encounter', profile.data?.subscription_type || 'free'))

  const restrictionEncounters = computed<Encounter[]>(() => {
    if (!profile.data) { return [] }
    const { userArr, nonUserArr } = sortEncountersByUserCreated(data.value, profile.data.id)

    return [...userArr.splice(0, max.value), ...nonUserArr]
  })

  const sortedEncounters = computed<SortedCampaignEncounter>(() => {
    return sortEncountersByCampaign(restrictionEncounters.value)
  })

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

  return {
    loading,
    error,
    data,
    restrictionEncounters,
    sortedEncounters,
    max,
    fetch,
    getEncountersByCampaign,
    addEncounter,
    copyEncounter,
    deleteEncounter,
    bulkDeleteEncounters,
    updateEncounter,
    shareEncounter
  }
})
