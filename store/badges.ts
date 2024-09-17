export const useBadgesStore = defineStore('useBadgesStore', () => {
  const supabase = useSupabaseClient()
  const profile = useProfileStore()
  const { t } = useI18n()

  const loading = ref<boolean>(false)
  const error = ref<string>()

  async function addBadge(code: string): Promise<boolean> {
    loading.value = true
    error.value = undefined

    try {
      const { data: result, error: err } = await supabase
        .from('badges')
        .select('id, background, color, description, icon, label')
        .eq('code', code)
        .single()

      if (err?.message === 'JSON object requested, multiple (or no) rows returned') {
        error.value = t('components.badgeModal.nothing')
      }
      else if (result && profile.data) {
        const badge: EarnedBadge = { ...result, earned: Date.now() }

        if (!profile.data.badges.find(b => b.label.nl === badge.label.nl)) {
          profile.data.badges.push(badge)
          await profile.updateProfile({ badges: profile.data.badges })

          return true
        }
        else {
          error.value = t('components.badgeModal.already')
        }
      }
      return false
    }
    catch (err) {
      console.error(err)
      error.value = err as string
      return false
    }
    finally {
      loading.value = false
    }
  }

  async function getBadgeById(id: number): Promise<Badge | undefined> {
    try {
      const { data: result, error: err } = await supabase
        .from('badges')
        .select('id, background, color, description, icon, label')
        .eq('id', id)
        .single()

      return result as Badge
    }
    catch (err) {
      console.error(err)
    }
  }

  return {
    loading,
    error,
    addBadge,
    getBadgeById,
  }
})
