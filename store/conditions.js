import { defineStore } from 'pinia'
import { useOpen5eStore } from '@/store/open5e'

export const useConditionsStore = defineStore('useConditionsStore', () => {
  const open5e = useOpen5eStore()

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
      const { results } = await open5e.getData({
        limit: 100,
        type: 'conditions'
      })
      data.value = results
    } catch (error) {
      error.value = error
    } finally {
      loading.value = false
    }
  }

  onMounted(() => fetch())

  return { loading, error, data, fetch }
})
