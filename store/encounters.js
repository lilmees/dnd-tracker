import { defineStore } from 'pinia'
import { sortByTeam } from '@/util/sortByTeam'
import { minutesAgo } from '@/util/minutesAgo'

export const useEncountersStore = defineStore('useEncountersStore', () => {

  const supabase = useSupabaseClient()

  const loading = ref(false)
  const error = ref(null)
  let data = ref(null)
  let lastFetched = ref(null)

  const sortedEncounters = computed(() => data.value ? sortByTeam(data.value) : null)

  async function fetch() {
    try {
      // check if there is data that is older then 5 minutes old otherwise refetch the data
      if ((!minutesAgo(5, lastFetched.value) && data.value) || loading.value) return
      else lastFetched = Date.now()

      loading.value = true
      error.value = null
      const { data: sheets, error: err } = await supabase
        .from('initiative_sheets')
        .select('*, profiles(id, name, username, avatar),campaign(id, title, background, color)')
      if (err) throw err
      if (sheets) data.value = sheets
    } catch (err) {
      console.error(err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function getEncountersByCampaign(campaign) {
    const { data: sheets, error: err } = await supabase
      .from('initiative_sheets')
      .select('*, profiles(id, name, username, avatar)')
      .eq('campaign', `${campaign}`)
    if (err) throw err
    else return sheets
  }

  async function addEncounter(encounter) {
    const { data: sheets, error: err } = await supabase.from('initiative_sheets').insert([encounter]).select('*')
    if (err) throw err
    else {
      data.value && data.value.length ? data.value.push(sheets[0]) : (data.value = [sheets[0]])
      return sheets[0]
    }
  }

  async function deleteEncounter(id) {
    const { data: sheets, error: err } = await supabase.from('initiative_sheets').delete().eq('id', id).select('*')
    if (err) throw err
    else {
      // check if the data is older than 5 minutes if so filter the encounters otherwise fetch data
      if (!minutesAgo(5, lastFetched.value)) data.value = data.value ? data.value.filter(d => d.id !== id) : []
      else fetch()
      return sheets
    }
  }

  async function deleteEncounterByCampaign(campaign) {
    const { data: sheets, error: err } = await supabase
      .from('initiative_sheets')
      .delete()
      .eq('campaign', `${campaign}`)
      .select('*')
    if (err) throw err
    else return sheets
  }

  async function updateEncounter(encounter, id) {
    const { data: sheets, error: err } = await supabase.from('initiative_sheets').update(encounter).eq('id', id).select('*')
    if (err) throw err
    else {
      if (data.value) {
        data.value = data.value.filter(e => e.id !== id)
        data.value.push(sheets[0])
      } else data.value = [sheets[0]]
      return sheets[0]
    }
  }

  return {
    loading,
    error,
    data,
    lastFetched,
    sortedEncounters,
    fetch,
    getEncountersByCampaign,
    addEncounter,
    deleteEncounter,
    deleteEncounterByCampaign,
    updateEncounter,
  }
})
