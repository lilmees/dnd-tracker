import { defineStore } from 'pinia'

export const useMonstersStore = defineStore('useMonstersStore', {
  state: () => ({
    sandboxMonsters: [
      { type: 'monster', id: 'lulu', name: 'Lulu', health: '69', ac: '20' },
      { type: 'monster', id: 'pony', name: 'Pony', health: '33', ac: '10' },
      { type: 'monster', id: 'rocky', name: 'Rocky', health: '24', ac: '16' },
      { type: 'monster', id: 'inli', name: 'Inli', health: '18', ac: '12' },
      { type: 'monster', id: 'gray', name: 'Gray', health: '20', ac: '16' },
      { type: 'monster', id: 'ginger', name: 'Ginger', health: '10', ac: '18' }
    ]
  }),
  actions: {
    async getMonsterByCampaignId (id) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('homebrew_items')
        .select('*')
        .eq('campaign', id)
        .eq('type', 'monster')
      if (error) {
        throw error
      } else {
        return data
      }
    },
    async getMonsterById (id) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('homebrew_items').select('*').eq('id', id).single()
      if (error) {
        throw error
      } else {
        return data
      }
    },
    async addMonster (monster) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('homebrew_items').insert([monster]).select('*')
      if (error) {
        throw error
      } else {
        return data[0]
      }
    },
    async deleteMonster (id) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('homebrew_items').delete().eq('id', id).select('*')
      if (error) {
        throw error
      } else {
        return data
      }
    },
    async updateMonster (monster, id) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('homebrew_items')
        .update(monster)
        .eq('id', id)
        .select('*')
        .eq('type', 'monster')
      if (error) {
        throw error
      } else {
        return data[0]
      }
    },
    async fuzzySearchMonsters (query, from, to) {
      const supabase = useSupabaseClient()
      const { error, data, count } = await supabase
        .from('monsters')
        .select('*', { count: 'exact' })
        .order('id', { ascending: true })
        .ilike('name', `%${query}%`)
        .range(from, to)
      if (error) {
        throw error
      } else {
        return { data, count }
      }
    }
  }
})
