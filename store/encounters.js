import { defineStore } from 'pinia'
import { sortByTeam } from '@/util/sortByTeam'
import { minutesAgo } from '@/util/minutesAgo'

export const useEncountersStore = defineStore('useEncountersStore', {
  state: () => ({
    loading: false,
    error: null,
    data: null,
    lastFetched: null,
    initiativeTypes: [
      { label: 'Player', id: 'player' },
      { label: 'Summon', id: 'summon' },
      { label: 'Npc', id: 'npc' },
      { label: 'Monster', id: 'monster' },
      { label: 'Lair', id: 'lair' },
    ],
  }),
  getters: {
    sortedEncounters: state => (state.data ? sortByTeam(state.data) : null),
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
          .from('initiative-sheets')
          .select('*, profiles(id, name, username, avatar),campaign(id, title, background, color)')
        if (error) throw error
        if (data) this.data = data
      } catch (error) {
        console.error(error)
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async getSandboxEncounter() {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('showcase').select('*').single()
      if (error) throw error
      else return data
    },
    async getEncounterById(id) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase
        .from('initiative-sheets')
        .select('*, profiles(id, name, username, avatar),campaign(id, title, background, color)')
        .eq('id', id)
        .single()
      if (error) throw error
      else return data
    },
    async getEncountersByCampaign(campaign) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase
        .from('initiative-sheets')
        .select('*, profiles(id, name, username, avatar)')
        .eq('campaign', `${campaign}`)
      if (error) throw error
      else return data
    },
    async addEncounter(encounter) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('initiative-sheets').insert([encounter]).select('*')
      if (error) throw error
      else {
        this.data && this.data.length ? this.data.push(data[0]) : (this.data = [data[0]])
        return data[0]
      }
    },
    async deleteEncounter(id) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('initiative-sheets').delete().eq('id', id).select('*')
      if (error) throw error
      else {
        // check if the data is older than 5 minutes if so filter the encounters otherwise fetch data
        if (!minutesAgo(5, this.lastFetched)) this.data = this.data ? this.data.filter(d => d.id !== id) : []
        else this.fetch()
        return data
      }
    },
    async deleteEncounterByCampaign(campaign) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase
        .from('initiative-sheets')
        .delete()
        .eq('campaign', `${campaign}`)
        .select('*')
      if (error) throw error
      else return data
    },
    async updateEncounter(encounter, id) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('initiative-sheets').update(encounter).eq('id', id).select('*')
      if (error) throw error
      else {
        if (this.data) {
          this.data = this.data.filter(e => e.id !== id)
          this.data.push(data[0])
        } else this.data = [data[0]]
        return data[0]
      }
    },
  },
})
