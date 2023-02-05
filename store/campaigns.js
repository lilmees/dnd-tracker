import { defineStore } from 'pinia'
import { minutesAgo } from '@/util/minutesAgo'
import { useEncountersStore } from '@/store/encounters'

export const useCampaignsStore = defineStore('useCampaignsStore', {
  state: () => ({
    loading: false,
    error: null,
    data: null,
    lastFetched: null,
  }),
  getters: {
    sortedCampaigns: state =>
      state.data ? state.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) : null,
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
        const { data, error } = await supabase.from('campaigns').select('*')
        if (error) throw error
        if (data) this.data = data
      } catch (error) {
        console.error(error)
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async getCampaignById(id) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase
        .from('campaigns')
        .select('*, players(*), homebrew-monsters(*), notes(*)')
        .eq('id', id)
        .single()
      if (error) throw error
      else return data
    },
    async addCampaign(campaign) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('campaigns').insert([campaign]).select('*')
      if (error) throw error
      else this.data.push(data[0])
    },
    async deleteCampaign(id) {
      const supabase = useSupabaseClient()
      const encounters = useEncountersStore()
      //delete encounters first
      await encounters.deleteEncounterByCampaign(id)
      const { data, error } = await supabase.from('campaigns').delete().eq('id', id).select('*')
      if (error) throw error
      else {
        // check if the data is older than 5 minutes if so filter the campaigns otherwise fetch data
        !minutesAgo(5, this.lastFetched) ? (this.data = this.data.filter(d => d.id !== id)) : this.fetch()
        return data
      }
    },
    async updateCampaign(campaign, id) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('campaigns').update(campaign).eq('id', id).select('*')
      if (error) throw error
      else {
        this.data = this.data.filter(e => e.id !== id)
        this.data.push(data[0])
      }
    },
  },
})
