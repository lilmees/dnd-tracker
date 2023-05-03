import { defineStore } from 'pinia'
import { useToastStore } from '@/store/toast'

export const useTableStore = defineStore('useTableStore', () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const localePath = useLocalePath()
  const toast = useToastStore()
  const { $i18n } = useNuxtApp()

  const encounter: Ref<Encounter | null> = ref(null)
  const isLoading: Ref<boolean> = ref(true)
  const isSandbox: Ref<boolean> = ref(false)

  const includesSummond: ComputedRef<boolean> = computed(() => {
    return encounter?.value?.rows && Array.isArray(encounter.value.rows)
      ? !!encounter.value.rows.flat().filter((r: Row) => r.summoner).length
      : false
  })

  async function getEncounter (id: string): Promise<void> {
    isSandbox.value = false
    isLoading.value = true

    const { data, error } = await supabase
      .from('initiative_sheets')
      .select('*, campaign(id, title, background, color)')
      .eq('id', id)
      .single()

    const enc = data as unknown as Encounter

    if (error) {
      throw error
    }
    if (user.value && !enc.admins.includes(user.value.id)) {
      navigateTo(localePath('/encounters'))
    }

    enc.rows = typeof enc.rows === 'string'
      ? JSON.parse(enc.rows)
      : enc.rows

    enc.rows = useIndexCorrecter(enc.rows as Row[])

    subscribeEncounterChanges()

    encounter.value = data
    isLoading.value = false
  }

  async function getSandboxEncounter (): Promise<void> {
    isSandbox.value = true
    const { data, error } = await supabase.from('showcase').select('*').single()

    if (error) {
      throw error
    }

    const enc = data as unknown as Encounter

    enc.rows = typeof enc.rows === 'string'
      ? JSON.parse(enc.rows)
      : enc.rows

    enc.rows = useIndexCorrecter(enc.rows as Row[])
    encounter.value = data
  }

  function subscribeEncounterChanges (): void {
    supabase
      .channel('initiative_sheets-updates')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'initiative_sheets' },
        (payload: SupabaseRealTime) => {
          if (payload.eventType === 'DELETE') {
            toast.info({
              title: $i18n.t('encounter.toast.removed.title'),
              text: $i18n.t('encounter.toast.removed.text')
            })
            navigateTo(localePath('/encounters'))
          } else {
            encounter.value = payload.new as Encounter
          }
        })
      .subscribe()
  }

  async function encounterUpdate (enc: EncounterUpdate): Promise<void> {
    if (enc.rows?.length) {
      enc.rows = useIndexCorrecter(enc.rows as Row[])
    }

    const { admins, created_at, created_by, id, ...data } = { ...encounter.value, ...enc }

    if (data.campaign && typeof data.campaign === 'object') {
      data.campaign = data.campaign.id
    }

    if (!isSandbox.value) {
      try {
        const { error } = await supabase
          .from('initiative_sheets')
          .update(data as never)
          .eq('id', id)

        if (error) {
          throw error
        }

        encounter.value = { ...encounter.value, ...enc } as Encounter
      } catch (err) {
        useBugsnag().notify(`Handeld in catch: ${err}`)
        toast.error()
      }
    } else {
      encounter.value = data as Encounter
    }
  }

  async function updateRow (key: string, value: never, row: Row, index: number): Promise<void> {
    const rows = encounter.value!.rows as Row[]
    // when updating health or ac also update the max values
    if (key === 'health' || key === 'ac') {
      row[`max${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof Row] = value
    }

    if (key === 'initiative') {
      const calculatedIndex = useCalculateIndex(rows as Row[], value)
      rows[index]!.initiative = value
      rows[index]!.index = calculatedIndex
    } else {
      row[key as keyof Row] = value
      rows[index] = row
    }

    await encounterUpdate({ rows })
  }

  function nextInitiative (): void {
    if (encounter.value?.activeIndex) {
      encounter.value.activeIndex + 1 < encounter.value.rows.length
        ? encounterUpdate({ activeIndex: encounter.value.activeIndex + 1 })
        : encounterUpdate({ activeIndex: 0, round: encounter.value.round + 1 })
    }
  }

  function prevInitiative (): void {
    if (encounter.value?.activeIndex && encounter.value.activeIndex !== 0 && encounter.value.round !== 1) {
      encounter.value.activeIndex === 0
        ? encounterUpdate({ activeIndex: encounter.value.rows.length - 1, round: encounter.value.round - 1 })
        : encounterUpdate({ activeIndex: encounter.value.activeIndex - 1 })
    }
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
    nextInitiative,
    prevInitiative
  }
})
