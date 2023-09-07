<script setup lang="ts">
const emit = defineEmits(['update'])
const props = defineProps<{
  hp: number|undefined,
  temp: number|undefined,
  max: number|undefined,
  maxOld: number|undefined
}>()

const isOpen = ref<boolean>(false)
const isRollingDice = ref<boolean>(false)
const type = ref<HPActionType>('heal')
const formAmount = ref<{ amount: number|undefined}>({ amount: undefined })
const formOverride = ref<{ amount: number|undefined}>({ amount: undefined })

const dice = '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="512" viewBox="0 0 480 512"><path fill="currentColor" d="M106.75 215.06L1.2 370.95c-3.08 5 .1 11.5 5.93 12.14l208.26 22.07l-108.64-190.1zM7.41 315.43L82.7 193.08L6.06 147.1c-2.67-1.6-6.06.32-6.06 3.43v162.81c0 4.03 5.29 5.53 7.41 2.09zM18.25 423.6l194.4 87.66c5.3 2.45 11.35-1.43 11.35-7.26v-65.67l-203.55-22.3c-4.45-.5-6.23 5.59-2.2 7.57zm81.22-257.78L179.4 22.88c4.34-7.06-3.59-15.25-10.78-11.14L17.81 110.35c-2.47 1.62-2.39 5.26.13 6.78l81.53 48.69zM240 176h109.21L253.63 7.62C250.5 2.54 245.25 0 240 0s-10.5 2.54-13.63 7.62L130.79 176H240zm233.94-28.9l-76.64 45.99l75.29 122.35c2.11 3.44 7.41 1.94 7.41-2.1V150.53c0-3.11-3.39-5.03-6.06-3.43zm-93.41 18.72l81.53-48.7c2.53-1.52 2.6-5.16.13-6.78l-150.81-98.6c-7.19-4.11-15.12 4.08-10.78 11.14l79.93 142.94zm79.02 250.21L256 438.32v65.67c0 5.84 6.05 9.71 11.35 7.26l194.4-87.66c4.03-1.97 2.25-8.06-2.2-7.56zm-86.3-200.97l-108.63 190.1l208.26-22.07c5.83-.65 9.01-7.14 5.93-12.14L373.25 215.06zM240 208H139.57L240 383.75L340.43 208H240z"/></svg>'

whenever(() => props.maxOld, () => {
  if (props.max) {
    formOverride.value.amount = props.max
  }
}, { immediate: true })

function overrideHealth (obj: Obj): void {
  if (obj.reset || (!isNaN(Number(obj.amount)) && Number(obj.amount) === props.maxOld)) {
    obj.amount = props.maxOld ?? 0
    type.value = 'override-reset'
  } else {
    type.value = 'override'
  }
  updateHealth(obj)
}

function updateHealth ({ __init, amount }: Obj): void {
  if (!isNaN(Number(amount))) {
    emit('update', { type: type.value, amount: Number(amount) })

    isOpen.value = false
    isRollingDice.value = false
  }

  resetState()
}

function resetState (): void {
  formAmount.value.amount = undefined
  formOverride.value.amount = undefined
  type.value = 'heal'
}
</script>

<template>
  <div>
    <Icon
      name="mdi:cards-heart-outline"
      class="w-6 h-6 cursor-pointer text-danger"
      @click="isOpen = true"
    />
    <Modal v-if="isOpen" @close="isOpen = false">
      <template #header>
        <h2>{{ $t('pages.encounter.update.hp') }}</h2>
      </template>
      <div
        v-if="(hp === 0 || hp) && (max === 0 || max)"
        class="flex flex-wrap gap-x-4 gap-y-2 pb-4 items-start justify-center"
      >
        <div class="p-2 rounded-lg space-y-2 min-w-[75px] bg-black/50 text-center">
          <p class="font-bold">
            {{ $t('general.current') }}
          </p>
          <p class="head-1" :class="{ 'text-danger': hp < 1 }">
            {{ hp }}
          </p>
        </div>
        <div class="p-2 rounded-lg space-y-2 min-w-[75px] bg-black/50 text-center">
          <p class="font-bold">
            {{ $t('general.max') }}
          </p>
          <div class="flex gap-1 items-start justify-center">
            <p
              class="head-1"
              :class="[!maxOld ? undefined : maxOld < max ? 'text-success' : 'text-danger']"
            >
              {{ max || 0 }}
            </p>
            <p v-if="maxOld === 0 || maxOld" class="body-small">
              ({{ maxOld }})
            </p>
          </div>
        </div>
        <div class="p-2 rounded-lg space-y-2 min-w-[75px] bg-black/50 text-center">
          <p class="font-bold">
            {{ $t('general.temp') }}
          </p>
          <p class="head-1">
            {{ temp || 0 }}
          </p>
        </div>
      </div>
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
            outer-class="grow"
            :suffix-icon="maxOld ? 'rewind' : undefined"
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
      <div class="w-full border border-black h-px my-6" />
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
          :suffix-icon="isRollingDice ? 'close' : dice"
          @suffix-icon-click="isRollingDice = !isRollingDice"
        />
        <DiceRolling
          v-if="isRollingDice"
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
    </Modal>
  </div>
</template>
