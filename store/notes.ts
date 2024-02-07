import logRocket from 'logrocket'

export const useNotesStore = defineStore('useNotesStore', () => {
  const supabase = useSupabaseClient()

  const loading = ref<boolean>(true)
  const data = ref<Note[]>([])
  const noteCount = ref<number>(0)
  const maxAmount = ref<number>(50)
  const search = ref<string>('')

  const visibleItems = computed<Note[]>(() => {
    return searchArray<Note>(data.value, 'title', search.value)
  })

  const noItems = computed<boolean>(() => visibleItems.value.length === 0 && !loading.value)

  async function fetch (eq?: SupabaseEq): Promise<void> {
    loading.value = true

    try {
      let query = supabase
        .from('notes')
        .select('*', { count: 'exact' })

      if (eq) {
        query = query.eq(eq.field, eq.value)
      }

      const { data: notes, error: err, count } = await query

      noteCount.value = count || 0

      if (err) {
        throw err
      }
      if (notes) {
        data.value = notes
      }
    } catch (err) {
      logRocket.captureException(err as Error)
    } finally {
      loading.value = false
    }
  }

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
      fetch()
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

    fetch()
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
      fetch()
      return data[0]
    }
  }

  return {
    noteCount,
    maxAmount,
    search,
    data,
    loading,
    visibleItems,
    noItems,
    fetch,
    getNoteById,
    addNote,
    deleteNote,
    updateNote
  }
})
