import { defineStore } from 'pinia'

export const useConditionsStore = defineStore('useConditionsStore', () => {
  const supabase = useSupabaseClient()

  const loading = ref(false)
  const error = ref(null)
  const data = ref(null)

  async function fetch () {
    if (data.value || loading.value) {
      return
    }

    loading.value = true
    error.value = null

    try {
      const { data, error } = await supabase.from('conditions').select('*')
      if (error) {
        throw error
      }
      if (data) {
        data.value = data
      }
    } catch (error) {
      error.value = error
    } finally {
      loading.value = false
    }
  }

  onMounted(() => fetch())

  return { loading, error, data, fetch }
})
