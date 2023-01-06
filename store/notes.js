import { defineStore } from 'pinia'

export const useNotesStore = defineStore('useNotesStore', {
  actions: {
    async getNoteById(id) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('notes').select('*').eq('id', id).single()
      if (error) throw error
      else return data
    },
    async addNote(note) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('notes').insert([note])
      if (error) throw error
      else return data[0]
    },
    async deleteNote(id) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('notes').delete().eq('id', id)
      if (error) throw error
      else return data
    },
    async updateNote(note, id) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('notes').update(note).eq('id', id)
      if (error) throw error
      else return data[0]
    },
  },
})
