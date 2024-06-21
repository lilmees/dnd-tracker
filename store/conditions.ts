import logRocket from 'logrocket'

export const useConditionsStore = defineStore('useConditionsStore', () => {
  const open5e = useOpen5eStore()

  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const data = ref<Condition[]>([])
  const conditionsWithLevels = ['Exhaustion']

  async function fetch(): Promise<void> {
    if (data.value?.length || loading.value) {
      return
    }

    loading.value = true
    error.value = null

    try {
      const { results } = await open5e.getData({
        limit: 100,
        type: 'conditions',
      })

      data.value = results.map((con) => {
        return {
          ...con,
          ...(conditionsWithLevels.includes(con.name) ? { hasLevels: true } : {}),
        }
      }) as unknown as Condition[]
    }
    catch (err) {
      logRocket.captureException(err as Error)
      error.value = err as string
    }
    finally {
      loading.value = false
    }
  }

  onMounted(() => fetch())

  return { loading, error, data, fetch }
})
