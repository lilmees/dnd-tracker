export const useNotesStore = defineStore('useNotesStore', () => {
  const supabase = useSupabaseClient()

  async function getNoteById (id: number): Promise<Note> {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw error
    } else {
      return data
    }
  }

  async function addNote (note: Note): Promise<Note> {
    const { data, error } = await supabase
      .from('notes')
      .insert([note as never])
      .select('*')

    if (error) {
      throw error
    } else {
      return data[0]
    }
  }

  async function deleteNote (id: number): Promise<void> {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }
  }

  async function updateNote (note: Note, id: number): Promise<Note> {
    const { data, error } = await supabase
      .from('notes')
      .update(note as never)
      .eq('id', id)
      .select('*')

    if (error) {
      throw error
    } else {
      return data[0]
    }
  }

  return {
    getNoteById,
    addNote,
    deleteNote,
    updateNote
  }
})
