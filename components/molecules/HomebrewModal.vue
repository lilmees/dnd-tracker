<script setup lang="ts">
import { reset } from '@formkit/core'
import logRocket from 'logrocket'

const emit = defineEmits(['updated'])
const props = withDefaults(
  defineProps<{
    item?: Homebrew,
    encounter?: boolean,
    update?: boolean
  }>(), {
    item: undefined,
    encounter: false,
    update: false
  }
)

const store = useCurrentCampaignStore()
const table = useTableStore()

const isOpen = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const error = ref<string>()

const form = ref<HomebrewForm>({
  name: props.item?.name || '',
  player: props.item?.player || '',
  link: props.item?.link || '',
  type: props.item?.type || 'player' as RowType,
  initiative: undefined,
  amount: undefined,
  summoner: undefined,
  ac: undefined,
  health: undefined,
  actions: getActions()
})

whenever(() => isOpen.value, () => { form.value.actions = getActions() })

const summonersOptions = computed<Option[]>(() => {
  if (table.encounter?.rows && props.encounter) {
    return table.encounter.rows
      .filter(r => r.type !== 'summon')
      .map((o) => {
        return { label: o.name, value: o.id }
      })
  } else {
    return []
  }
})

function getActions (): Action[] {
  return props.item
    ? [
        ...props.item.actions,
        ...props.item.legendary_actions,
        ...props.item.reactions,
        ...props.item.special_abilities
      ]
    : []
}

function handleSumbit ({ __init, data, slots, ...formData }: Obj): void {
  error.value = ''
  isLoading.value = true

  try {
    const { actions, ...homebrewData } = formData

    homebrewData.actions = []
    homebrewData.legendary_actions = []
    homebrewData.reactions = []
    homebrewData.special_abilities = []

    if (actions.length) {
      actions.forEach((a: Action) => {
        homebrewData[a.type || 'action'] = [...homebrewData[a.type || 'action'] || [], a]
      })
    }

    if (props.encounter) {
      addInitiative(homebrewData)
    } else if (props.update) {
      updateHomebrew(homebrewData)
    } else {
      addHomebrew(homebrewData)
    }

    reset('form')
    closeModal()
  } catch (err: any) {
    logRocket.captureException(err as Error)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

async function updateHomebrew (formData : Obj): Promise<void> {
  if (!props.item?.id) {
    return
  }

  const updated = useEmptyKeyRemover(formData) as Homebrew
  await store.updateHomebrew(updated, props.item.id as number)

  emit('updated', updated)
}

async function addHomebrew (formData : Obj): Promise<void> {
  await store.addHomebrew(
    useEmptyKeyRemover({
      ...formData,
      campaign: store?.campaign?.id
    }) as AddHomebrew
  )
}

async function addInitiative ({ amount, ...data }: Obj): Promise<void> {
  if (!table.encounter?.rows) {
    return
  }

  const rows = []

  if (!amount) {
    amount = 1
  }

  if (typeof data.summoner === 'number') {
    const sum = table.encounter.rows.filter(r => r.id === data.summoner)[0]
    data.summoner = { name: sum.name, id: +sum.id }
  }

  for (let i = 0; i < amount; i++) {
    rows.push(useCreateRow(data as Row, form.value.type as RowType, table.encounter.rows))
  }

  await table.encounterUpdate({
    rows: [...table.encounter.rows, ...rows]
  } as UpdateEncounter)
}

function closeModal (): void {
  form.value.type = 'player'
  isOpen.value = false
}
</script>

<template>
  <section>
    <button
      v-tippy="{ content: $t(
        encounter
          ? 'components.homebrewModal.add'
          : update ? 'actions.update' : 'actions.add'
      ) }"
      :aria-label="$t(
        encounter
          ? 'components.homebrewModal.add'
          : update ? 'actions.update' : 'actions.add'
      )"
      class="flex gap-2 items-center disabled:opacity-40 disabled:cursor-not-allowed"
      @click="isOpen = true"
    >
      <span v-if="encounter" class="md:hidden">
        {{ $t('components.homebrewModal.add') }}
      </span>
      <Icon
        :name="encounter ? 'ph:beer-stein' : update ? 'lucide:wrench' : 'material-symbols:add'"
        :class="{
          'text-info w-6 h-6': update && !encounter,
          'text-success w-6 h-6': !update && !encounter,
          'text-warning w-10 h-10': !update && encounter
        }"
        aria-hidden="true"
      />
    </button>
    <Modal v-if="isOpen" @close="closeModal">
      <template #header>
        <h2>
          {{ $t(`components.homebrewModal.${update ? 'update' : 'new'}`) }}
        </h2>
      </template>
      <FormKit
        id="form"
        v-model="form"
        type="form"
        :actions="false"
        @submit="handleSumbit"
      >
        <div
          :class="{
            'grid sm:grid-cols-2 gap-x-3': (form.type === 'monster' || form.type === 'summon') && encounter
          }"
        >
          <FormKit
            type="select"
            name="type"
            :label="$t('components.inputs.typeLabel')"
            :placeholder="$t('components.inputs.nothing')"
            validation="required"
            :options="[
              { label: 'Player', value: 'player' },
              { label: 'Summon', value: 'summon' },
              { label: 'Npc', value: 'npc' },
              { label: 'Monster', value: 'monster' },
              { label: 'Lair', value: 'lair' }
            ]"
            outer-class="grow"
          />
          <FormKit
            v-if="(form.type === 'monster' || form.type === 'summon') && encounter"
            name="amount"
            type="number"
            min="1"
            max="15"
            :label="$t('components.inputs.amountLabel')"
            validation="between:1,15|number|required"
            outer-class="grow"
          />
        </div>
        <FormKit
          v-if="encounter && form.type === 'summon'"
          type="select"
          name="summoner"
          :label="$t('components.inputs.summonerLabel')"
          :placeholder="$t('components.inputs.nothing')"
          validation="required"
          :options="summonersOptions"
        />
        <div :class="{ 'grid sm:grid-cols-2 gap-x-3': form.type === 'player' && !encounter }">
          <FormKit
            name="name"
            :label="$t('components.inputs.nameLabel')"
            validation="required|length:3,30"
            outer-class="grow"
          />
          <FormKit
            v-if="form.type === 'player' && !encounter"
            name="player"
            :label="$t('components.inputs.playerLabel')"
            validation="length:3,30"
            outer-class="grow"
          />
        </div>
        <div
          v-if="encounter"
          class="flex w-full flex-row gap-x-3 items-center"
        >
          <FormKit
            name="initiative"
            type="number"
            min="1"
            max="50"
            :label="$t('components.inputs.initiativeLabel')"
            validation="between:1,50|number"
            outer-class="grow"
          />
          <button
            type="button"
            class="btn-black mt-1"
            :aria-label="$t('actions.roll')"
            @click="form.initiative = useDiceRoll(20) as number"
          >
            {{ $t('actions.roll') }}
          </button>
        </div>
        <div
          v-if="form.type !== 'lair'"
          class="flex flex-row gap-x-3 items-center"
        >
          <FormKit
            name="ac"
            type="number"
            min="1"
            max="100"
            :label="$t('components.inputs.acLabel')"
            validation="between:1,100|number"
            outer-class="grow"
          />
          <FormKit
            name="health"
            type="number"
            min="1"
            max="1000"
            :label="$t('components.inputs.hpLabel')"
            validation="between:1,1000|number"
            outer-class="grow"
          />
        </div>
        <FormKit
          type="repeater"
          name="actions"
          :label="$t('components.inputs.actionsLabel')"
          :add-label="$t('components.inputs.addActionLabel')"
          :max="10"
          :min="0"
          :remove-control="true"
        >
          <FormKit
            type="select"
            name="type"
            :label="$t('components.inputs.actionTypeLabel')"
            :placeholder="$t('components.inputs.nothing')"
            validation="required"
            :options="[
              { label: 'Action', value: 'actions' },
              { label: 'Legendary action', value: 'legendary_actions' },
              { label: 'Reaction', value: 'reactions' },
              { label: 'Special ability', value: 'special_abilities' }
            ]"
          />
          <FormKit
            name="name"
            :label="$t('components.inputs.nameLabel')"
            validation="required|length:3,30"
          />
          <FormKit
            name="desc"
            type="textarea"
            :label="$t('components.inputs.descriptionLabel')"
            validation="required|length:10,500"
          />
          <div class="flex gap-x-3">
            <FormKit
              name="damage_dice"
              placeholder="2d6"
              :label="$t('components.inputs.damageDiceLabel')"
              validation="length:3,15"
              outer-class="grow"
            />
            <FormKit
              name="damage_bonus"
              type="number"
              min="1"
              max="100"
              :label="$t('components.inputs.damageBonusLabel')"
              validation="between:1,100|number"
              outer-class="grow"
            />
            <FormKit
              name="attack_bonus"
              type="number"
              min="1"
              max="100"
              :label="$t('components.inputs.attackBonusLabel')"
              validation="between:1,100|number"
              outer-class="grow"
            />
          </div>
        </FormKit>
        <p v-if="error" class="text-danger body-small mt-1">
          {{ error }}
        </p>
        <div class="flex justify-end">
          <FormKit
            type="submit"
            :label="$t(
              encounter || (!encounter && !update)
                ? 'components.homebrewModal.add'
                :'components.homebrewModal.update'
            )"
            :disabled="isLoading"
            input-class="$reset btn-primary"
          />
        </div>
      </FormKit>
    </Modal>
  </section>
</template>
