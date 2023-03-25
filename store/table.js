import { correctRowItemIndexes } from '@/util/correctRowItemIndexes'
import { calculateRowIndex } from '@/util/calculateRowIndex'
import { useToastStore } from '@/store/toast'
import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'

export const useTableStore = defineStore('useTableStore', () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const localePath = useLocalePath()
  const toast = useToastStore()
  const { t } = useI18n({ useScope: 'global' })

  const encounter = ref(null)
  const isLoading = ref(true)
  const isSandbox = ref(false)

  const includesSummond = computed(() => {
    return !!encounter.value.rows.flat().filter(r => r.summoner).length
  })

  async function getEncounter(id) {
    isSandbox.value = false
    isLoading.value = true

    const { data, error } = await supabase
      .from('initiative-sheets')
      .select('*, profiles(id, name, username, avatar),campaign(id, title, background, color)')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data.admins.includes(user.value.id)) navigateTo(localePath('/encounters'))

    data.rows = typeof data.rows === 'string' ? JSON.parse(data.rows) : data.rows
    data.rows = correctRowItemIndexes(data.rows)

    subscribeEncounterChanges()

    encounter.value = data
    isLoading.value = false
  }

  async function getSandboxEncounter() {
    isSandbox.value = true
    const { data, error } = await supabase.from('showcase').select('*').single()

    if (error) throw error

    data.rows = typeof data.rows === 'string' ? JSON.parse(data.rows) : data.rows
    data.rows = correctRowItemIndexes(data.rows)
    encounter.value = data
  }

  async function subscribeEncounterChanges() {
    supabase
      .channel('initiative-sheets-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'initiative-sheets' }, payload => {
        if (payload.eventType === 'DELETE') {
          toast.info({ title: t('encounter.toast.removed.title'), text: t('encounter.toast.removed.text') })
          navigateTo(localePath('/encounters'))
        } else {
          encounter.value = payload.new
        }
      })
      .subscribe()
  }

  async function encounterUpdate(enc) {
    if (enc.rows?.length) enc.rows = correctRowItemIndexes(enc.rows)
    const { admins, created_at, created_by, id, profiles, ...data } = { ...encounter.value, ...enc }
    if (data.campaign && typeof data.campaign === 'object') data.campaign = data.campaign.id
    if (!isSandbox.value) {
      try {
        const { error } = await supabase.from('initiative-sheets').update(data).eq('id', id)
        if (error) throw error
        encounter.value = { ...encounter.value, ...enc }
      } catch (error) {
        toast.error({ title: t('error.general.title'), text: t('error.general.text') })
      }
    } else encounter.value = data
  }

  async function updateRow(key, value, row, index) {
    let rows = encounter.value.rows
    // when updating health or ac also update the max values
    if (key === 'health' || key === 'ac') row[`max${key.charAt(0).toUpperCase() + key.slice(1)}`] = value

    if (key === 'initiative') {
      const calculatedIndex = calculateRowIndex(rows, value)
      rows[index].initiative = value
      rows[index].index = calculatedIndex
    } else {
      row[key] = value
      rows[index] = row
    }

    await encounterUpdate({ rows })
  }

  function nextInitiative() {
    encounter.value.activeIndex + 1 < encounter.value.rows.length
      ? encounterUpdate({ activeIndex: encounter.value.activeIndex + 1 })
      : encounterUpdate({ activeIndex: 0, round: encounter.value.round + 1 })
  }

  return {
    encounter,
    isLoading,
    isSandbox,
    includesSummond,
    getEncounter,
    getSandboxEncounter,
    subscribeEncounterChanges,
    encounterUpdate,
    updateRow,
    nextInitiative
  }
})
