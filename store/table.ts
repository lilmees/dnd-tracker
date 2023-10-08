import logRocket from 'logrocket'
import { isMember } from '@/utils/permission-helpers'

export const useTableStore = defineStore('useTableStore', () => {
  const supabase = useSupabaseClient()
  const profile = useProfileStore()
  const localePath = useLocalePath()
  const toast = useToastStore()
  const { t } = useI18n()

  const encounter = ref<Encounter | null>(null)
  const isLoading = ref<boolean>(true)
  const isSandbox = ref<boolean>(false)

  const activeModal = ref<EncounterModal>()
  const activeField = ref<EncounterUpdateField>()
  const activeRow = ref<Row>()
  const activeIndex = ref<number>()

  const includesSummond = computed<boolean>(() => {
    return encounter?.value?.rows && Array.isArray(encounter.value.rows)
      ? !!encounter.value.rows.flat().filter((r: Row) => r.summoner).length
      : false
  })

  async function getEncounter (id: string): Promise<void> {
    isSandbox.value = false
    isLoading.value = true

    const { data, error } = await supabase
      .from('initiative_sheets')
      .select('*, campaign(id, title, background, color, created_by, team(*))')
      .eq('id', id)
      .single()

    const enc = data as unknown as Encounter

    if (error) {
      throw error
    }

    if (typeof enc.campaign !== 'number' && profile.data && !isMember(enc.campaign, profile.data.id)) {
      navigateTo(localePath('/not-member'))
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
              title: t('pages.encounter.toasts.removed.title'),
              text: t('pages.encounter.toasts.removed.text')
            })
            navigateTo(localePath('/encounters'))
          } else {
            encounter.value = payload.new as Encounter
          }
        })
      .subscribe()
  }

  async function encounterUpdate (enc: UpdateEncounter): Promise<void> {
    if (enc.rows?.length) {
      enc.rows = useIndexCorrecter(enc.rows as Row[])
    }

    const { admins, created_at, created_by, id, ...data } = { ...encounter.value, ...enc }

    if (data.campaign && typeof data.campaign === 'object') {
      data.campaign = data.campaign.id
    }

    if (!isSandbox.value && id) {
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
        logRocket.captureException(err as Error)
        toast.error()
      }
    } else {
      encounter.value = data as Encounter
    }
  }

  async function updateRow (value: never): Promise<void> {
    if (!activeRow.value || activeIndex.value === undefined) { return }

    const rows = encounter.value!.rows as Row[]
    // when updating health or ac also update the max values
    if (activeField.value === 'health' || activeField.value === 'ac') {
      activeRow.value[`max${activeField.value.charAt(0).toUpperCase() + activeField.value.slice(1)}` as keyof Row] = value
    }

    if (activeField.value === 'initiative') {
      const calculatedIndex = useCalculateIndex(rows as Row[], value)
      rows[activeIndex.value]!.initiative = value
      rows[activeIndex.value]!.index = calculatedIndex
    } else {
      activeRow.value[activeField.value as keyof Row] = value
      rows[activeIndex.value] = activeRow.value
    }

    if (activeRow.value.deathSaves) {
      checkDeathSaves(activeRow.value.deathSaves)
      activeRow.value.deathSaves.stable = activeRow.value.deathSaves.save.every(v => v === true)
    }

    await encounterUpdate({ rows })

    resetActiveState()
  }

  function resetActiveState (): void {
    activeIndex.value = undefined
    activeRow.value = undefined
    activeModal.value = undefined
    activeField.value = undefined
  }

  function nextInitiative (): void {
    if (encounter.value && encounter.value.activeIndex >= 0) {
      encounter.value.activeIndex + 1 < encounter.value.rows.length
        ? encounterUpdate({ activeIndex: encounter.value.activeIndex + 1 })
        : encounterUpdate({ activeIndex: 0, round: encounter.value.round + 1 })
    }
  }

  function prevInitiative (): void {
    if (encounter.value) {
      if (encounter.value.activeIndex === 0 && encounter.value.round === 1) {
        return
      }
      encounter.value.activeIndex === 0
        ? encounterUpdate({ activeIndex: encounter.value.rows.length - 1, round: encounter.value.round - 1 })
        : encounterUpdate({ activeIndex: encounter.value.activeIndex - 1 })
    }
  }

  function checkDeathSaves (saves: DeathSaves): void {
    if (!saves.stable) {
      if (saves.fail.every(v => v === true)) {
        toast.info({
          title: t('pages.encounter.toasts.died.title'),
          text: t('pages.encounter.toasts.died.textDeathSaves')
        })
      } else if (saves.save.every(v => v === true)) {
        toast.info({
          title: t('pages.encounter.toasts.stable.title'),
          text: t('pages.encounter.toasts.stable.textDeathSaves')
        })
      }
    }
  }

  return {
    encounter,
    isLoading,
    isSandbox,
    includesSummond,
    activeModal,
    activeRow,
    activeIndex,
    activeField,
    getEncounter,
    getSandboxEncounter,
    subscribeEncounterChanges,
    encounterUpdate,
    updateRow,
    nextInitiative,
    prevInitiative,
    checkDeathSaves,
    resetActiveState
  }
})
