import { defineStore } from 'pinia'

export const usePlayersStore = defineStore('usePlayersStore', {
  actions: {
    async getPlayerByCampaignId(id) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('players').select('*').eq('campaign', id)
      if (error) throw error
      else return data
    },
    async getPlayerById(id) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('players').select('*').eq('id', id).single()
      if (error) throw error
      else return data
    },
    async addPlayer(player) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('players').insert([player])
      if (error) throw error
      else return data[0]
    },
    async deletePlayer(id) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('players').delete().eq('id', id)
      if (error) throw error
      else return data
    },
    async updatePlayer(player, id) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('players').update(player).eq('id', id)
      if (error) throw error
      else return data[0]
    },
  },
})
