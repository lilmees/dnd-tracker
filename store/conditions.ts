import { defineStore } from 'pinia'
import { useOpen5eStore } from '@/store/open5e'

export const useConditionsStore = defineStore('useConditionsStore', () => {
  const open5e = useOpen5eStore()
  const { $logRocket } = useNuxtApp()

  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  const data: Ref<Condition[]> = ref([])

  async function fetch (): Promise<void> {
    if (data.value || loading.value) {
      return
    }

    loading.value = true
    error.value = null

    try {
      const { results } = await open5e.getData({
        limit: 100,
        type: 'conditions'
      }) as { results: Condition[] }

      data.value = results
    } catch (err) {
      $logRocket.captureException(err as Error)
      error.value = err as string
    } finally {
      loading.value = false
    }
  }

  onMounted(() => fetch())

  return { loading, error, data, fetch }
})
