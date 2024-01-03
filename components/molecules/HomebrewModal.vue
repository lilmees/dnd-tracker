<script setup lang="ts">
import { reset } from '@formkit/core'
import logRocket from 'logrocket'

const emit = defineEmits(['updated', 'close'])
const props = withDefaults(
  defineProps<{
    open: boolean
    item?: Homebrew
    encounter?: boolean
    update?: boolean
    disabled?: boolean
  }>(),
  {
    item: undefined,
    encounter: false,
    update: false,
    disabled: false
  }
)

const store = useCurrentCampaignStore()
const table = useTableStore()

const isLoading = ref<boolean>(false)
const error = ref<string>()

const form = ref<HomebrewForm>(setForm())

const dice =
  '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="512" viewBox="0 0 480 512"><path fill="currentColor" d="M106.75 215.06L1.2 370.95c-3.08 5 .1 11.5 5.93 12.14l208.26 22.07l-108.64-190.1zM7.41 315.43L82.7 193.08L6.06 147.1c-2.67-1.6-6.06.32-6.06 3.43v162.81c0 4.03 5.29 5.53 7.41 2.09zM18.25 423.6l194.4 87.66c5.3 2.45 11.35-1.43 11.35-7.26v-65.67l-203.55-22.3c-4.45-.5-6.23 5.59-2.2 7.57zm81.22-257.78L179.4 22.88c4.34-7.06-3.59-15.25-10.78-11.14L17.81 110.35c-2.47 1.62-2.39 5.26.13 6.78l81.53 48.69zM240 176h109.21L253.63 7.62C250.5 2.54 245.25 0 240 0s-10.5 2.54-13.63 7.62L130.79 176H240zm233.94-28.9l-76.64 45.99l75.29 122.35c2.11 3.44 7.41 1.94 7.41-2.1V150.53c0-3.11-3.39-5.03-6.06-3.43zm-93.41 18.72l81.53-48.7c2.53-1.52 2.6-5.16.13-6.78l-150.81-98.6c-7.19-4.11-15.12 4.08-10.78 11.14l79.93 142.94zm79.02 250.21L256 438.32v65.67c0 5.84 6.05 9.71 11.35 7.26l194.4-87.66c4.03-1.97 2.25-8.06-2.2-7.56zm-86.3-200.97l-108.63 190.1l208.26-22.07c5.83-.65 9.01-7.14 5.93-12.14L373.25 215.06zM240 208H139.57L240 383.75L340.43 208H240z"/></svg>'
const random =
  '<svg xmlns="http://www.w3.org/2000/svg" width="1792.01" height="1600" viewBox="0 0 1792 1600"><path fill="currentColor" d="M666 449q-60 92-137 273q-22-45-37-72.5T451.5 586t-51-56.5t-63-35T256 480H32q-14 0-23-9t-9-23V256q0-14 9-23t23-9h224q250 0 410 225zm1126 799q0 14-9 23l-320 320q-9 9-23 9q-13 0-22.5-9.5t-9.5-22.5v-192q-32 0-85 .5t-81 1t-73-1t-71-5t-64-10.5t-63-18.5t-58-28.5t-59-40t-55-53.5t-56-69.5q59-93 136-273q22 45 37 72.5t40.5 63.5t51 56.5t63 35t81.5 14.5h256V928q0-14 9-23t23-9q12 0 24 10l319 319q9 9 9 23zm0-896q0 14-9 23l-320 320q-9 9-23 9q-13 0-22.5-9.5T1408 672V480h-256q-48 0-87 15t-69 45t-51 61.5t-45 77.5q-32 62-78 171q-29 66-49.5 111t-54 105t-64 100t-74 83t-90 68.5t-106.5 42t-128 16.5H32q-14 0-23-9t-9-23v-192q0-14 9-23t23-9h224q48 0 87-15t69-45t51-61.5t45-77.5q32-62 78-171q29-66 49.5-111t54-105t64-100t74-83t90-68.5t106.5-42t128-16.5h256V32q0-14 9-23t23-9q12 0 24 10l319 319q9 9 9 23z"/></svg>'

whenever(
  () => props.open,
  () => {
    form.value = setForm()
  }
)

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

function setForm (): HomebrewForm {
  return {
    name: props.item?.name || '',
    player: props.item?.player || '',
    link: props.item?.link || '',
    type: props.item?.type || ('player' as RowType),
    initiative: undefined,
    initiative_modifier: props.item?.initiative_modifier || undefined,
    amount: undefined,
    summoner: undefined,
    ac: props.item?.ac,
    health: props.item?.health,
    actions: props.item
      ? [...props.item.actions, ...props.item.legendary_actions, ...props.item.reactions, ...props.item.special_abilities]
      : []
  }
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
        homebrewData[a.type || 'action'] = [...(homebrewData[a.type || 'action'] || []), a]
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

async function updateHomebrew (formData: Obj): Promise<void> {
  if (!props.item?.id) {
    return
  }

  const updated = useEmptyKeyRemover(formData) as Homebrew
  await store.updateHomebrew(updated, props.item.id as number)

  emit('updated', updated)
}

async function addHomebrew (formData: Obj): Promise<void> {
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
  reset('form')
  form.value.type = 'player'
  emit('close')
}
</script>

<template>
  <Modal :open="open" @close="closeModal">
    <template #header>
      <h2>
        {{ $t(`components.homebrewModal.${update ? 'update' : 'new'}`) }}
      </h2>
    </template>
    <FormKit id="form" v-model="form" type="form" :actions="false" @submit="handleSumbit">
      <div
        :class="{
          'grid sm:grid-cols-2 gap-x-3': (form.type === 'monster' || form.type === 'summon') && encounter,
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
            { label: 'Lair', value: 'lair' },
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
          :suffix-icon="random"
          @suffix-icon-click="() => {
            form.name = useRandomName()
          }"
        />
        <FormKit
          v-if="form.type === 'player' && !encounter"
          name="player"
          :label="$t('components.inputs.playerLabel')"
          validation="length:3,30"
          outer-class="grow"
        />
      </div>
      <div :class="{ 'grid sm:grid-cols-2 gap-x-3': encounter }">
        <FormKit
          v-if="encounter"
          name="initiative"
          type="number"
          min="1"
          max="50"
          :label="$t('components.inputs.initiativeLabel')"
          validation="between:1,50|number"
          :suffix-icon="dice"
          @suffix-icon-click="() => {
            form.initiative = useDiceRoll(20) as number
          }"
        />
        <FormKit
          name="initiative_modifier"
          max="10"
          min="-10"
          type="number"
          :label="`${$t('components.inputs.initiativeLabel')} (MODIFIER)`"
          validation="between:-10,10|number"
        />
      </div>
      <div v-if="form.type !== 'lair'" class="grid sm:grid-cols-2 gap-x-3">
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
      <FormKit name="link" type="url" :label="$t('components.inputs.linkLabel')" validation="url" />
      <FormKit
        type="repeater"
        name="actions"
        :label="$t('components.inputs.actionsLabel')"
        :add-label="$t('components.inputs.addActionLabel')"
        :max="20"
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
            { label: 'Special ability', value: 'special_abilities' },
          ]"
        />
        <FormKit name="name" :label="$t('components.inputs.nameLabel')" validation="required|length:3,30" />
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
          :label="
            $t(
              encounter || (!encounter && !update)
                ? 'components.homebrewModal.add'
                : 'components.homebrewModal.update'
            )
          "
          :disabled="isLoading"
          input-class="$reset btn-primary"
        />
      </div>
    </FormKit>
  </Modal>
</template>
