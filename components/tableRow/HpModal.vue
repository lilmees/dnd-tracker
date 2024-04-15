<script setup lang="ts">
const emit = defineEmits(['close'])

const toast = useToastStore()
const store = useTableStore()
const { t } = useI18n()

const isRollingDice = ref<boolean>(false)
const type = ref<HPActionType>('heal')
const formAmount = ref<{ amount: number|undefined}>({ amount: undefined })
const formOverride = ref<{ amount: number|undefined}>({ amount: undefined })

whenever(() => store.activeRow?.maxHealthOld, () => {
  if (store.activeRow?.maxHealth) {
    formOverride.value.amount = store.activeRow?.maxHealth
  }
}, { immediate: true })

function overrideHealth (obj: Obj): void {
  if (obj.reset || (!isNaN(Number(obj.amount)) && Number(obj.amount) === store.activeRow?.maxHealthOld)) {
    obj.amount = store.activeRow?.maxHealthOld ?? 0
    type.value = 'override-reset'
  } else {
    type.value = 'override'
  }
  updateHealth(obj)
}

function updateHealth ({ __init, amount }: Obj): void {
  if (!isNaN(Number(amount)) && store.activeRow) {
    handleHpChanges(Number(amount))

    if (store.encounter && store.activeIndex !== undefined) {
      const rows = store.encounter.rows
      rows[store.activeIndex] = store.activeRow
      store.encounterUpdate({ rows })
    }

    isRollingDice.value = false
  }

  resetState()
}

function handleHpChanges (number: number): void {
  if (!store.activeRow) { return }

  const initType = t(`general.${store.activeRow.type}`)

  handleDeathSaves()

  switch (type.value) {
    case 'heal':
      if (typeof store.activeRow.health === 'number' && typeof store.activeRow.maxHealth === 'number') {
        store.activeRow.health + number > store.activeRow.maxHealth
          ? (store.activeRow.health = store.activeRow.maxHealth)
          : (store.activeRow.health = store.activeRow.health + number)
      }
      break
    case 'damage':
      if (typeof store.activeRow.tempHealth === 'number') {
        if (store.activeRow.tempHealth >= number) {
          store.activeRow.tempHealth = store.activeRow.tempHealth - number
        } else if (store.activeRow.health) {
          store.activeRow.health = store.activeRow.health - (number - store.activeRow.tempHealth)
          store.activeRow.tempHealth = 0
        }
      } else if (store.activeRow.health) {
        store.activeRow.health = store.activeRow.health - number
      }

      if (typeof store.activeRow.health === 'number' && store.activeRow.health <= 0) {
        resetDeathSaves()
      } else if (store.activeRow.concentration) {
        toast.info({
          title: t('pages.encounter.toasts.concentration.title'),
          text: t('pages.encounter.toasts.concentration.text', { type: initType })
        })
      }
      break
    case 'temp':
      if (store.activeRow?.health && store.activeRow.health > 0) {
        store.activeRow.tempHealth = number
      }
      break
    case 'override':
      if (store.activeRow.health && store.activeRow.maxHealth) {
        store.activeRow.health = number < store.activeRow.maxHealth
          ? number
          : number - (store.activeRow.maxHealth - store.activeRow.health)
      } else {
        store.activeRow.health = number
      }

      store.activeRow.maxHealthOld = store.activeRow.maxHealth || number
      store.activeRow.maxHealth = number
      break
    case 'override-reset':
      if (store.activeRow.health && store.activeRow.maxHealth && store.activeRow.maxHealthOld) {
        store.activeRow.health = store.activeRow.maxHealthOld < store.activeRow.maxHealth
          ? number
          : number - (store.activeRow.maxHealth - store.activeRow.health)
      }

      store.activeRow.maxHealthOld = undefined
      store.activeRow.maxHealth = number
      break
  }

  // when user is dies because of going to much in the negative hp
  if (
    (
      store.activeRow.health &&
      store.activeRow.maxHealth &&
      store.activeRow.health < 0 &&
      Math.abs(store.activeRow.health) >= store.activeRow.maxHealth
    ) ||
    (
      hasDeathSaves(store.activeRow.type) &&
      store.activeRow.deathSaves.fail.every(v => v === true)
    )
  ) {
    toast.info({
      title: t('pages.encounter.toasts.died.title', { type: initType }),
      text: t('pages.encounter.toasts.died.textMinHP', { type: initType.toLowerCase() })
    })
  }

  // when health is an negative number change it to 0
  if (store.activeRow.health && store.activeRow.health < 0) {
    store.activeRow.health = 0
  }
}

function handleDeathSaves (): void {
  if (store.activeRow && store.activeRow.health === 0) {
    if (hasDeathSaves(store.activeRow.type)) {
      store.activeRow.deathSaves.stable = false
    }

    if (type.value !== 'heal') {
      let updatedFails = 0
      store.activeRow.deathSaves.fail.forEach((s, i) => {
        if (!s && updatedFails < 2 && store.activeRow) {
          store.activeRow.deathSaves.fail[i] = true
          updatedFails++
        }
      })
      store.checkDeathSaves(store.activeRow.deathSaves, store.activeRow.type)
    } else {
      resetDeathSaves()
    }
  }
}

function resetDeathSaves (): void {
  if (store.activeRow && hasDeathSaves(store.activeRow.type)) {
    store.activeRow.deathSaves.fail = [false, false, false]
    store.activeRow.deathSaves.save = [false, false, false]
  }
}

function resetState (): void {
  formAmount.value.amount = undefined
  formOverride.value.amount = undefined
  type.value = 'heal'
  emit('close')
}
</script>

<template>
  <Modal :title="false" @close="$emit('close')">
    <div
      v-if="
        (store.activeRow?.health === 0 || store.activeRow?.health)
          && (store.activeRow?.maxHealth === 0 || store.activeRow?.maxHealth)
      "
      class="flex flex-wrap gap-x-4 gap-y-2 pb-6 items-start justify-center"
    >
      <div class="p-2 rounded-lg space-y-2 min-w-[75px] bg-black/50 text-center">
        <p class="font-bold">
          {{ $t('general.current') }}
        </p>
        <p
          class="head-1"
          :class="{ 'text-danger': store.activeRow.health < 1 }"
        >
          {{ store.activeRow.health }}
        </p>
      </div>
      <div class="p-2 rounded-lg space-y-2 min-w-[75px] bg-black/50 text-center">
        <p class="font-bold">
          {{ $t('general.max') }}
        </p>
        <div class="flex gap-1 items-start justify-center">
          <p
            class="head-1"
            :class="[
              !store.activeRow.maxHealthOld
                ? undefined
                : store.activeRow.maxHealthOld < store.activeRow.maxHealth
                  ? 'text-success'
                  : 'text-danger'
            ]"
          >
            {{ store.activeRow.maxHealth || 0 }}
          </p>
          <p
            v-if="store.activeRow.maxHealthOld === 0 || store.activeRow.maxHealthOld"
            class="body-small"
          >
            ({{ store.activeRow.maxHealthOld }})
          </p>
        </div>
      </div>
      <div class="p-2 rounded-lg space-y-2 min-w-[75px] bg-black/50 text-center">
        <p class="font-bold">
          {{ $t('general.temp') }}
        </p>
        <p class="head-1">
          {{ store.activeRow?.tempHealth || 0 }}
        </p>
      </div>
    </div>
    <h2 class="mb-6">
      {{ $t('pages.encounter.update.hp') }}
    </h2>
    <FormKit
      v-model="formAmount"
      :actions="false"
      type="form"
      @submit="updateHealth"
    >
      <FormKit
        name="amount"
        type="number"
        :label="$t('components.inputs.amountLabel')"
        validation="required|between:1,1000|number"
        :suffix-icon="isRollingDice ? 'close' : 'dice'"
        @suffix-icon-click="isRollingDice = !isRollingDice"
      />
      <DiceRolling
        :show="isRollingDice"
        @result="(v) => {
          formAmount.amount = v
          isRollingDice = false
        }"
      />
      <div class="flex gap-2 flex-wrap justify-end items-center">
        <button
          type="submit"
          class="btn-success"
          :aria-label="$t('actions.heal')"
          @click="type = 'heal'"
        >
          {{ $t('actions.heal') }}
        </button>
        <button
          type="submit"
          class="btn-primary"
          :aria-label="$t('actions.temp')"
          @click="type = 'temp'"
        >
          {{ $t('actions.temp') }}
        </button>
        <button
          type="submit"
          class="btn-danger"
          :aria-label="$t('actions.damage')"
          @click="type = 'damage'"
        >
          {{ $t('actions.damage') }}
        </button>
      </div>
    </FormKit>
    <div class="w-full border border-black h-px my-6" />
    <h2 class="mb-6">
      {{ $t('pages.encounter.override.hp') }}
    </h2>
    <FormKit
      v-model="formOverride"
      :actions="false"
      type="form"
      @submit="overrideHealth"
    >
      <div class="flex gap-2 items-start">
        <FormKit
          type="number"
          name="amount"
          :label="$t('components.inputs.overrideFieldLabel', { field: 'HP' })"
          :help="$t('components.inputs.optionalFieldHelp', { field: 'HP' })"
          validation="required|between:1,1000|number"
          validation-visibility="submit"
          outer-class="grow"
          :suffix-icon="store.activeRow?.maxHealthOld ? 'rewind' : undefined"
          @suffix-icon-click="overrideHealth({ reset: true })"
        />
        <FormKit
          type="submit"
          :aria-label="$t('actions.update')"
          outer-class="mt-6"
        >
          {{ $t('actions.save') }}
        </FormKit>
      </div>
    </FormKit>
  </Modal>
</template>
