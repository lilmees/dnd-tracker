import logRocket from 'logrocket'

export const useTableStore = defineStore('useTableStore', () => {
  const supabase = useSupabaseClient()
  const profile = useProfileStore()
  const localePath = useLocalePath()
  const toast = useToastStore()
  const { t } = useI18n()
  const route = useRoute()

  const encounter = ref<Encounter | null>(null)
  const isLoading = ref<boolean>(true)
  const isSyncing = ref<boolean>(false)
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

  const isPlayground = computed<boolean>(() => route.fullPath.includes('/playground'))
  const isHome = computed<boolean>(() => route.fullPath.replace('en', '') === '/')

  async function getEncounter (id: string): Promise<void> {
    isSandbox.value = false
    isLoading.value = true

    const { data, error } = await supabase
      .from('initiative_sheets')
      .select('*, campaign(id, title, background, color, created_by(id, created_at, username, name, avatar, email, badges), team(*))')
      .eq('id', id)
      .single()

    const enc = data as unknown as Encounter

    if (error) {
      throw error
    }

    if (enc.campaign && profile.data && !isMember(enc.campaign, profile.data.id)) {
      navigateTo(localePath('/not-member'))
    }

    enc.rows = typeof enc.rows === 'string'
      ? JSON.parse(enc.rows)
      : enc.rows

    enc.rows = useIndexCorrecter(enc.rows as Row[])

    if (enc.campaign && profile.data && isMedior(profile.data)) {
      subscribeEncounterChanges()
    }

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
          isSyncing.value = true

          if (payload.eventType === 'DELETE') {
            if (route.fullPath.includes('/encounters/')) {
              toast.info({
                title: t('pages.encounter.toasts.removed.title'),
                text: t('pages.encounter.toasts.removed.text')
              })
              navigateTo(localePath('/encounters'))
            }
          } else {
            const { campaign, created_at, id, ...updated } = payload.new
            encounter.value = { ...encounter.value, ...updated } as Encounter
          }

          isSyncing.value = false
        })
      .subscribe()
  }

  async function encounterUpdate (enc: UpdateEncounter): Promise<void> {
    isSyncing.value = true

    if (enc.rows?.length) {
      enc.rows = useIndexCorrecter(enc.rows as Row[])
    }

    const { created_at, created_by, id, ...data } = { ...encounter.value, ...enc }

    if (data.campaign && typeof data.campaign === 'object') {
      data.campaign = data.campaign.id
    }

    if (!isSandbox.value && !isPlayground.value && id) {
      try {
        const { data: updated, error } = await supabase
          .from('initiative_sheets')
          .update(data as never)
          .eq('id', id)
          .select('*, campaign(id, title, background, color, created_by(id, created_at, username, name, avatar, email, badges), team(*))')

        if (error) {
          throw error
        }

        encounter.value = updated[0] as Encounter
      } catch (err) {
        logRocket.captureException(err as Error)
        toast.error()
      }
    } else {
      encounter.value = data as Encounter
    }

    isSyncing.value = false
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

  function setPlaygroundValues (): void {
    encounter.value = {
      title: 'Day of Dungeons 2024',
      round: 1,
      rows: [
        {
          type: 'lair',
          id: 1710875489128,
          name: 'Lair action',
          created_at: 'now',
          campaign: 1,
          conditions: [],
          index: 0,
          initiative: 20,
          note: ''
        },
        {
          name: 'Aboleth',
          type: 'monster',
          actions: [
            {
              name: 'Multiattack',
              desc: 'The aboleth makes three tentacle attacks.'
            },
            {
              name: 'Tentacle',
              desc: "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 12 (2d6 + 5) bludgeoning damage. If the target is a creature, it must succeed on a DC 14 Constitution saving throw or become diseased. The disease has no effect for 1 minute and can be removed by any magic that cures disease. After 1 minute, the diseased creature's skin becomes translucent and slimy, the creature can't regain hit points unless it is underwater, and the disease can be removed only by heal or another disease-curing spell of 6th level or higher. When the creature is outside a body of water, it takes 6 (1d12) acid damage every 10 minutes unless moisture is applied to the skin before 10 minutes have passed.",
              attack_bonus: 9,
              damage_dice: '2d6',
              damage_bonus: 5
            },
            {
              name: 'Tail',
              desc: 'Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 15 (3d6 + 5) bludgeoning damage.',
              attack_bonus: 9,
              damage_dice: '3d6',
              damage_bonus: 5
            },
            {
              name: 'Enslave (3/day)',
              desc: "The aboleth targets one creature it can see within 30 ft. of it. The target must succeed on a DC 14 Wisdom saving throw or be magically charmed by the aboleth until the aboleth dies or until it is on a different plane of existence from the target. The charmed target is under the aboleth's control and can't take reactions, and the aboleth and the target can communicate telepathically with each other over any distance.\nWhenever the charmed target takes damage, the target can repeat the saving throw. On a success, the effect ends. No more than once every 24 hours, the target can also repeat the saving throw when it is at least 1 mile away from the aboleth."
            }
          ],
          reactions: null,
          legendary_actions: [
            {
              name: 'Detect',
              desc: 'The aboleth makes a Wisdom (Perception) check.'
            },
            {
              name: 'Tail Swipe',
              desc: 'The aboleth makes one tail attack.'
            },
            {
              name: 'Psychic Drain (Costs 2 Actions)',
              desc: 'One creature charmed by the aboleth takes 10 (3d6) psychic damage, and the aboleth regains hit points equal to the damage the creature takes.'
            }
          ],
          special_abilities: [
            {
              name: 'Amphibious',
              desc: 'The aboleth can breathe air and water.'
            },
            {
              name: 'Mucous Cloud',
              desc: 'While underwater, the aboleth is surrounded by transformative mucus. A creature that touches the aboleth or that hits it with a melee attack while within 5 ft. of it must make a DC 14 Constitution saving throw. On a failure, the creature is diseased for 1d4 hours. The diseased creature can breathe only underwater.'
            },
            {
              name: 'Probing Telepathy',
              desc: "If a creature communicates telepathically with the aboleth, the aboleth learns the creature's greatest desires if the aboleth can see the creature."
            }
          ],
          id: 1710875400128,
          conditions: [],
          index: 1,
          initiative: -1,
          initiative_modifier: 1,
          note: '',
          health: 135,
          ac: 17,
          maxHealth: 135,
          maxAc: 17,
          tempHealth: 0,
          tempAc: 0,
          concentration: false,
          deathSaves: {
            save: [
              false,
              false,
              false
            ],
            fail: [
              false,
              false,
              false
            ],
            stable: false
          },
          link: 'https://www.aidedd.org/dnd/monstres.php?vo=aboleth'
        },
        {
          name: 'Air Elemental',
          type: 'monster',
          actions: [
            {
              name: 'Multiattack',
              desc: 'The elemental makes two slam attacks.'
            },
            {
              name: 'Slam',
              desc: 'Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 14 (2d8 + 5) bludgeoning damage.',
              attack_bonus: 8,
              damage_dice: '2d8',
              damage_bonus: 5
            },
            {
              name: 'Whirlwind (Recharge 4-6)',
              desc: "Each creature in the elemental's space must make a DC 13 Strength saving throw. On a failure, a target takes 15 (3d8 + 2) bludgeoning damage and is flung up 20 feet away from the elemental in a random direction and knocked prone. If a thrown target strikes an object, such as a wall or floor, the target takes 3 (1d6) bludgeoning damage for every 10 feet it was thrown. If the target is thrown at another creature, that creature must succeed on a DC 13 Dexterity saving throw or take the same damage and be knocked prone.\nIf the saving throw is successful, the target takes half the bludgeoning damage and isn't flung away or knocked prone."
            }
          ],
          reactions: null,
          legendary_actions: null,
          special_abilities: [
            {
              name: 'Air Form',
              desc: "The elemental can enter a hostile creature's space and stop there. It can move through a space as narrow as 1 inch wide without squeezing."
            }
          ],
          initiative_modifier: 3,
          id: 1710875473580,
          conditions: [],
          index: 2,
          initiative: -1,
          note: '',
          health: 90,
          ac: 15,
          maxHealth: 90,
          maxAc: 15,
          tempHealth: 0,
          tempAc: 0,
          concentration: false,
          deathSaves: {
            save: [
              false,
              false,
              false
            ],
            fail: [
              false,
              false,
              false
            ],
            stable: false
          }
        },
        {
          type: 'player',
          id: 1710875489136,
          name: 'Carlo',
          health: 37,
          ac: 13,
          created_at: 'now',
          campaign: 1,
          conditions: [
            {
              slug: 'deafened',
              name: 'Deafened',
              desc: "* A deafened creature can't hear and automatically fails any ability check that requires hearing.",
              document__slug: 'wotc-srd',
              document__title: '5e Core Rules',
              document__url: 'http://dnd.wizards.com/articles/features/systems-reference-document-srd'
            }
          ],
          index: 3,
          initiative: -1,
          initiative_modifier: 2,
          note: '',
          maxHealth: 37,
          maxAc: 13,
          tempHealth: 6,
          tempAc: 0,
          concentration: false,
          deathSaves: {
            save: [
              false,
              false,
              false
            ],
            fail: [
              false,
              false,
              false
            ],
            stable: false
          }
        },
        {
          type: 'player',
          id: 1710875489116,
          name: 'Silvin',
          health: 33,
          ac: 14,
          created_at: 'now',
          campaign: 1,
          conditions: [],
          index: 4,
          initiative: -1,
          initiative_modifier: 1,
          note: '',
          maxHealth: 33,
          maxAc: 14,
          tempHealth: 0,
          tempAc: 0,
          concentration: true,
          deathSaves: {
            save: [
              false,
              false,
              false
            ],
            fail: [
              false,
              false,
              false
            ],
            stable: false
          }
        },
        {
          type: 'player',
          id: 1710875489191,
          name: 'Alexis',
          health: 29,
          ac: 12,
          created_at: 'now',
          campaign: 1,
          conditions: [],
          index: 5,
          initiative: -1,
          initiative_modifier: -1,
          note: '',
          maxHealth: 29,
          maxAc: 12,
          tempHealth: 0,
          tempAc: 0,
          concentration: false,
          deathSaves: {
            save: [
              false,
              false,
              false
            ],
            fail: [
              false,
              false,
              false
            ],
            stable: false
          }
        },
        {
          type: 'player',
          id: 1710875489158,
          name: 'Banthaaja',
          health: 30,
          ac: 15,
          created_at: 'now',
          initiative_modifier: 2,
          campaign: 1,
          conditions: [],
          index: 6,
          initiative: -1,
          note: '',
          maxHealth: 30,
          maxAc: 15,
          tempHealth: 0,
          tempAc: 6,
          concentration: false,
          deathSaves: {
            save: [
              false,
              false,
              false
            ],
            fail: [
              false,
              false,
              false
            ],
            stable: false
          }
        },
        {
          type: 'npc',
          id: 1710875489198,
          name: 'Bijoux',
          health: 0,
          ac: 16,
          created_at: 'now',
          initiative_modifier: 4,
          campaign: 1,
          conditions: [
            {
              slug: 'exhaustion',
              name: 'Exhaustion',
              desc: "* Some special abilities and environmental hazards, such as starvation and the long-term effects of freezing or scorching temperatures, can lead to a special condition called exhaustion. Exhaustion is measured in six levels. An effect can give a creature one or more levels of exhaustion, as specified in the effect's description.\n\n| Level | Effect                                         |\n|-------|------------------------------------------------|\n| 1     | Disadvantage on ability checks                 |\n| 2     | Speed halved                                   |\n| 3     | Disadvantage on attack rolls and saving throws |\n| 4     | Hit point maximum halved                       |\n| 5     | Speed reduced to 0                             |\n| 6     | Death                                          |\n\nIf an already exhausted creature suffers another effect that causes exhaustion, its current level of exhaustion increases by the amount specified in the effect's description.\n\nA creature suffers the effect of its current level of exhaustion as well as all lower levels. For example, a creature suffering level 2 exhaustion has its speed halved and has disadvantage on ability checks.\n\nAn effect that removes exhaustion reduces its level as specified in the effect's description, with all exhaustion effects ending if a creature's exhaustion level is reduced below 1.\n\nFinishing a long rest reduces a creature's exhaustion level by 1, provided that the creature has also ingested some food and drink.",
              document__slug: 'wotc-srd',
              document__title: '5e Core Rules',
              document__url: 'http://dnd.wizards.com/articles/features/systems-reference-document-srd'
            }
          ],
          index: 7,
          initiative: -1,
          note: '',
          maxHealth: 55,
          maxAc: 16,
          tempHealth: 0,
          tempAc: 0,
          concentration: false,
          deathSaves: {
            save: [
              true,
              false,
              false
            ],
            fail: [
              true,
              true,
              false
            ],
            stable: false
          }
        },
        {
          type: 'npc',
          id: 1710875489207,
          name: 'Nooi',
          health: 20,
          ac: 16,
          created_at: 'now',
          campaign: 1,
          conditions: [],
          index: 8,
          initiative: -1,
          initiative_modifier: 3,
          note: '',
          maxHealth: 20,
          maxAc: 16,
          tempHealth: 0,
          tempAc: 0,
          concentration: false,
          deathSaves: {
            save: [
              false,
              false,
              false
            ],
            fail: [
              false,
              false,
              false
            ],
            stable: false
          }
        }
      ],
      background: '#7333E0',
      color: '#FFFFFF',
      activeIndex: 0,
      info_cards: [
        {
          slug: 'acid-arrow',
          name: 'Acid Arrow',
          desc: 'A shimmering green arrow streaks toward a target within range and bursts in a spray of acid. Make a ranged spell attack against the target. On a hit, the target takes 4d4 acid damage immediately and 2d4 acid damage at the end of its next turn. On a miss, the arrow splashes the target with acid for half as much of the initial damage and no damage at the end of its next turn.',
          higher_level: 'When you cast this spell using a spell slot of 3rd level or higher, the damage (both initial and later) increases by 1d4 for each slot level above 2nd.',
          page: 'phb 259',
          range: '90 feet',
          target_range_sort: 90,
          components: 'V, S, M',
          requires_verbal_components: true,
          requires_somatic_components: true,
          requires_material_components: true,
          material: "Powdered rhubarb leaf and an adder's stomach.",
          can_be_cast_as_ritual: false,
          ritual: 'no',
          duration: 'Instantaneous',
          concentration: 'no',
          requires_concentration: false,
          casting_time: '1 action',
          level: '2nd-level',
          level_int: 2,
          spell_level: 2,
          school: 'Evocation',
          dnd_class: 'Druid, Wizard',
          spell_lists: [
            'wizard',
            'druid'
          ],
          archetype: 'Druid: Swamp',
          circles: 'Swamp',
          document__slug: 'wotc-srd',
          document__title: '5e Core Rules',
          document__license_url: 'http://open5e.com/legal',
          document__url: 'http://dnd.wizards.com/articles/features/systems-reference-document-srd'
        },
        {
          slug: 'acid-splash',
          name: 'Acid Splash',
          desc: 'You hurl a bubble of acid. Choose one creature within range, or choose two creatures within range that are within 5 feet of each other. A target must succeed on a dexterity saving throw or take 1d6 acid damage.',
          higher_level: "This spell's damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).",
          page: 'phb 211',
          range: '60 feet',
          target_range_sort: 60,
          components: 'V, S',
          requires_verbal_components: true,
          requires_somatic_components: true,
          requires_material_components: false,
          material: '',
          can_be_cast_as_ritual: false,
          ritual: 'no',
          duration: 'Instantaneous',
          concentration: 'no',
          requires_concentration: false,
          casting_time: '1 action',
          level: 'Cantrip',
          level_int: 0,
          spell_level: 0,
          school: 'Conjuration',
          dnd_class: 'Sorcerer, Wizard',
          spell_lists: [
            'wizard',
            'sorcerer'
          ],
          archetype: '',
          circles: '',
          document__slug: 'wotc-srd',
          document__title: '5e Core Rules',
          document__license_url: 'http://open5e.com/legal',
          document__url: 'http://dnd.wizards.com/articles/features/systems-reference-document-srd'
        }
      ],
      settings: {
        spacing: 'normal',
        rows: [
          'summoner',
          'ac',
          'health',
          'conditions',
          'note',
          'deathSaves',
          'concentration',
          'modify'
        ],
        widgets: [
          'info-pins',
          'fantasy-name-generator'
        ],
        modified: true
      }
    }

    isLoading.value = false
  }

  async function loadSharedEncounter (hash: string): Promise<void> {
    try {
      const id = decodeURIComponent(window.atob(hash))

      const sheet = await $fetch(`/api/encounter/playground/${id}`)

      encounter.value = {
        id: 1,
        created_at: `${Date.now()}`,
        created_by: 'user',
        ...sheet
      } as Encounter
    } catch (err) {
      setPlaygroundValues()
      toast.error()
    } finally {
      isLoading.value = false
    }
  }

  return {
    encounter,
    isLoading,
    isSyncing,
    isSandbox,
    isPlayground,
    isHome,
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
    resetActiveState,
    setPlaygroundValues,
    loadSharedEncounter
  }
})
