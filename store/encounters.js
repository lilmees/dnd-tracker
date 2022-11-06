import { defineStore } from 'pinia'
import { sortByTeam } from '@/util/sortByTeam'
import { minutesAgo } from '@/util/minutesAgo'

export const useEncountersStore = defineStore('useEncountersStore', {
  state: () => ({
    loading: false,
    error: null,
    data: null,
    lastFetched: null,
  }),
  getters: {
    sortedEncounters: state => (state.data ? sortByTeam(state.data) : []),
  },
  actions: {
    async fetch() {
      const supabase = useSupabaseClient()
      try {
        // check if there is data that is older then 5 minutes old otherwise refetch the data
        if ((!minutesAgo(5, this.lastFetched) && this.data) || this.loading) return
        else this.lastFetched = Date.now()

        this.loading = true
        this.error = null
        const { data, error } = await supabase
          .from('initiative_sheets')
          .select('*, profiles(id, name, username, avatar)')
        if (error) throw error
        if (data) this.data = data
      } catch (error) {
        console.error(error)
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async addEncounter(encounter) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('initiative_sheets').insert([encounter])
      if (error) throw error
      else this.data.push(data[0])
    },
    async deleteEncounter(id) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('initiative_sheets').delete().eq('id', id)
      if (error) throw error
      else {
        // check if the data is older than 5 minutes if so filter the encounters otherwise fetch data
        !minutesAgo(5, this.lastFetched) ? (this.data = this.data.filter(d => d.id !== id)) : this.fetch()
        return data
      }
    },
    async updateEncounter(encounter, id) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('initiative_sheets').update(encounter).eq('id', id)
      if (error) throw error
      else {
        this.data = this.data.filter(e => e.id !== id)
        this.data.push(data[0])
      }
    },
  },
})
