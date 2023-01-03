import { defineStore } from 'pinia'

export const useMonstersStore = defineStore('useMonstersStore', {
  actions: {
    async getMonsterById(id) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('homebrew-monsters').select('*').eq('id', id).single()
      if (error) throw error
      else return data
    },
    async addMonster(monster) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('homebrew-monsters').insert([monster])
      if (error) throw error
      else return data[0]
    },
    async deleteMonster(id) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('homebrew-monsters').delete().eq('id', id)
      if (error) throw error
      else return data
    },
    async updateMonster(monster, id) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('homebrew-monsters').update(monster).eq('id', id)
      if (error) throw error
      else return data[0]
    },
  },
})
