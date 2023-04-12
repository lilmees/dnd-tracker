import { defineStore } from 'pinia'

export const usePlayersStore = defineStore('usePlayersStore', {
  state: () => ({
    sandboxPlayers: [
      { type: 'player', id: 'nelson', name: 'Nelson', health: '37', ac: '13' },
      { type: 'player', id: 'silvin', name: 'Silvin', health: '33', ac: '14' },
      { type: 'player', id: 'alexis', name: 'Alexis', health: '29', ac: '12' },
      { type: 'player', id: 'thernus', name: 'Thernus', health: '31', ac: '16' },
      { type: 'player', id: 'banthaaja', name: 'Banthaaja', health: '30', ac: '15' }
    ]
  }),
  actions: {
    async getPlayerByCampaignId (id) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('players').select('*').eq('campaign', id)
      if (error) {
        throw error
      } else {
        return data
      }
    },
    async getPlayerById (id) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('players').select('*').eq('id', id).single()
      if (error) {
        throw error
      } else {
        return data
      }
    },
    async addPlayer (player) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('players').insert([player]).select('*')
      if (error) {
        throw error
      } else {
        return data[0]
      }
    },
    async deletePlayer (id) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('players').delete().eq('id', id).select('*')
      if (error) {
        throw error
      } else {
        return data
      }
    },
    async updatePlayer (player, id) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('players').update(player).eq('id', id).select('*')
      if (error) {
        throw error
      } else {
        return data[0]
      }
    }
  }
})
