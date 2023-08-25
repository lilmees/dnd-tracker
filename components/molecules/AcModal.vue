<script setup lang="ts">
const emit = defineEmits(['update'])

defineProps<{
  ac: number | null,
  tempAc: number | null
}>()

const isOpen = ref<boolean>(false)
const isRollingDice = ref<boolean>(false)
const type = ref<string | null>(null)
const form = ref<{ ac: number | null }>({ ac: null })

function diceResult (amount: number): void {
  form.value.ac = amount
}

function updateAc ({ __init, ac }: Obj): void {
  emit('update', { type: type.value, amount: Number(ac) })
  resetState()
}

function resetAc (): void {
  emit('update', { type: 'reset' })
  resetState()
}

function resetState (): void {
  isOpen.value = false
  isRollingDice.value = false
  type.value = null
}
</script>

<template>
  <div>
    <Icon
      name="ic:outline-shield"
      class="w-6 h-6 cursor-pointer text-help"
      @click="isOpen = true"
    />
    <Modal v-if="isOpen" @close="isOpen = false">
      <template #header>
        <h2>{{ $t('pages.encounter.update.ac') }}</h2>
      </template>
      <FormKit
        v-model="form"
        type="form"
        :actions="false"
        @submit="updateAc"
      >
        <div class="flex gap-2 items-end">
          <div class="grow">
            <Input
              focus
              name="ac"
              type="number"
              :label="$t('components.inputs.acLabel')"
              validation="required|between:1,100|number"
              required
            />
          </div>
          <div class="mb-3">
            <button
              class="btn-black w-full"
              :aria-label="isRollingDice ? $t('actions.rollHide') : $t('actions.roll')"
              @click="isRollingDice = !isRollingDice"
            >
              {{ isRollingDice ? $t('actions.rollHide') : $t('actions.roll') }}
            </button>
          </div>
        </div>
        <DiceRolling v-if="isRollingDice" @result="diceResult" />
        <div class="flex gap-2 flex-wrap py-2">
          <button
            type="submit"
            class="btn-success grow"
            :aria-label="$t('actions.reset')"
            @click="resetAc"
          >
            {{ $t('actions.reset') }}
          </button>
          <button
            type="submit"
            class="btn-primary grow"
            :aria-label="$t('actions.temp')"
            @click="type = 'temp'"
          >
            {{ $t('actions.temp') }}
          </button>
          <button
            type="submit"
            class="btn-danger grow"
            :aria-label="$t('actions.remove')"
            @click="type = 'remove'"
          >
            {{ $t('actions.remove') }}
          </button>
          <button
            type="submit"
            class="btn-warning grow"
            :aria-label="$t('actions.baseAc')"
            @click="type = 'base'"
          >
            {{ $t('actions.baseAc') }}
          </button>
        </div>
      </FormKit>
    </Modal>
  </div>
</template>
