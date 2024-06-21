<script setup lang="ts">
const emit = defineEmits(['close'])

const store = useTableStore()

const isRollingDice = ref<boolean>(false)
const type = ref<ACActionType>('temp')
const formAmount = ref<{ amount: number | undefined }>({ amount: undefined })
const formOverride = ref<{ amount: number | undefined }>({ amount: undefined })

whenever(() => store.activeRow?.maxAcOld, () => {
  if (store.activeRow?.maxAc) {
    formOverride.value.amount = store.activeRow?.maxAc
  }
}, { immediate: true })

function resetAc(): void {
  type.value = 'reset'
  handleAcChanges(0)
  isRollingDice.value = false
  resetState()
}

function overrideAc(obj: Obj): void {
  if (obj.reset || (!isNaN(Number(obj.amount)) && Number(obj.amount) === store.activeRow?.maxAcOld)) {
    obj.amount = store.activeRow?.maxAcOld ?? 0
    type.value = 'override-reset'
  }
  else {
    type.value = 'override'
  }
  updateAc(obj)
}

function updateAc({ __init, amount }: Obj): void {
  if (!isNaN(Number(amount)) && store.activeRow) {
    handleAcChanges(Number(amount))

    if (store.encounter && store.activeIndex !== undefined) {
      const rows = store.encounter.rows
      rows[store.activeIndex] = store.activeRow
      store.encounterUpdate({ rows })
    }

    isRollingDice.value = false
  }

  resetState()
}

function handleAcChanges(number: number): void {
  if (!store.activeRow) {
    return
  }

  switch (type.value) {
    case 'reset':
      store.activeRow.ac = store.activeRow.maxAc
      store.activeRow.tempAc = 0
      break
    case 'remove':
      if (store.activeRow.tempAc) {
        if (store.activeRow.tempAc >= number) {
          store.activeRow.tempAc = store.activeRow.tempAc - number
        }
        else if (store.activeRow.ac) {
          store.activeRow.ac = store.activeRow.ac - (number - store.activeRow.tempAc)
          store.activeRow.tempAc = 0
        }
      }
      else if (store.activeRow.ac) {
        store.activeRow.ac = store.activeRow.ac - number
      }
      break
    case 'temp':
      store.activeRow.tempAc = number
      break
    case 'override':
      if (store.activeRow.ac && store.activeRow.maxAc) {
        store.activeRow.ac = number < store.activeRow.maxAc
          ? number
          : number - (store.activeRow.maxAc - store.activeRow.ac)
      }
      else {
        store.activeRow.ac = number
      }

      store.activeRow.maxAcOld = store.activeRow.maxAc || number
      store.activeRow.maxAc = number
      break
    case 'override-reset':
      if (store.activeRow.ac && store.activeRow.maxAc && store.activeRow.maxAcOld) {
        store.activeRow.ac = store.activeRow.maxAcOld < store.activeRow.maxAc
          ? number
          : number - (store.activeRow.maxAc - store.activeRow.ac)
      }

      store.activeRow.maxAcOld = undefined
      store.activeRow.maxAc = number
      break
  }
  // when ac is an negative number change it to 0
  if (store.activeRow?.ac && store.activeRow.ac < 0) {
    store.activeRow.ac = 0
  }
}

function resetState(): void {
  formAmount.value.amount = undefined
  formOverride.value.amount = undefined
  type.value = 'temp'
  emit('close')
}
</script>

<template>
  <Modal
    :title="false"
    @close="$emit('close')"
  >
    <div
      v-if="
        (store.activeRow?.ac === 0 || store.activeRow?.ac)
          && (store.activeRow?.maxAc === 0 || store.activeRow?.maxAc)
      "
      class="flex flex-wrap gap-x-4 gap-y-2 pb-6 items-start justify-center"
    >
      <div class="p-2 rounded-lg space-y-2 min-w-[75px] bg-black/50 text-center">
        <p class="font-bold">
          {{ $t('general.current') }}
        </p>
        <p
          class="head-1"
          :class="{ 'text-danger': store.activeRow.ac < 1 }"
        >
          {{ store.activeRow.ac }}
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
              !store.activeRow?.maxAcOld
                ? undefined
                : store.activeRow.maxAcOld < store.activeRow.maxAc
                  ? 'text-success'
                  : 'text-danger',
            ]"
          >
            {{ store.activeRow.maxAc || 0 }}
          </p>
          <p
            v-if="store.activeRow.maxAcOld === 0 || store.activeRow.maxAcOld"
            class="body-small"
          >
            ({{ store.activeRow.maxAcOld }})
          </p>
        </div>
      </div>
      <div class="p-2 rounded-lg space-y-2 min-w-[75px] bg-black/50 text-center">
        <p class="font-bold">
          {{ $t('general.temp') }}
        </p>
        <p class="head-1">
          {{ store.activeRow.tempAc || 0 }}
        </p>
      </div>
    </div>
    <h2 class="mb-6">
      {{ $t('pages.encounter.update.ac') }}
    </h2>
    <FormKit
      v-model="formAmount"
      type="form"
      :actions="false"
      @submit="updateAc"
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
      <div class="flex gap-2 flex-wrap py-2 justify-end">
        <button
          type="submit"
          class="btn-success"
          :aria-label="$t('actions.reset')"
          @click="resetAc"
        >
          {{ $t('actions.reset') }}
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
          :aria-label="$t('actions.remove')"
          @click="type = 'remove'"
        >
          {{ $t('actions.remove') }}
        </button>
      </div>
    </FormKit>
    <div class="w-full border border-black h-px my-6" />
    <h2 class="mb-6">
      {{ $t('pages.encounter.override.ac') }}
    </h2>
    <FormKit
      v-model="formOverride"
      :actions="false"
      type="form"
      @submit="overrideAc"
    >
      <div class="flex gap-2 items-start">
        <FormKit
          type="number"
          name="amount"
          :label="$t('components.inputs.overrideFieldLabel', { field: 'AC' })"
          :help="$t('components.inputs.optionalFieldHelp', { field: 'AC' })"
          validation="required|between:1,1000|number"
          validation-visibility="submit"
          outer-class="grow"
          :suffix-icon="store.activeRow?.maxAcOld ? 'rewind' : undefined"
          @suffix-icon-click="overrideAc({ reset: true })"
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
