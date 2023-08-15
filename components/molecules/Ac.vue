<script setup lang="ts">
const emit = defineEmits(['update'])
defineProps<{
  ac: number | null,
  tempAc: number | null
  type: string
}>()

const isOpen = ref<boolean>(false)
const isRollingDice = ref<boolean>(false)
const form = ref<{ ac: number | null }>({ ac: null })

function diceResult (amount: number): void {
  form.value.ac = amount
}

function updateAc ({ __init, ac }: Obj): void {
  emit('update', Number(ac))
  isOpen.value = false
  isRollingDice.value = false
}
</script>

<template>
  <div>
    <div class="flex gap-2 items-center">
      <div class="peer cursor-pointer flex gap-1" @click="isOpen = true">
        <p v-if="ac !== null">
          {{ ac }}
        </p>
        <p
          v-else-if="type !== 'lair'"
          class="text-slate-600"
        >
          Add
        </p>
        <span
          v-if="ac !== null && tempAc"
          class="text-warning"
        >+{{ tempAc }}</span>
      </div>
      <Icon
        name="lucide:wrench"
        class="w-4 h-4 opacity-0 peer-hover:opacity-100 duration-200 ease-in-out"
        :class="{ hidden: !ac }"
      />
    </div>
    <Modal v-if="isOpen" @close="isOpen = false">
      <h2>{{ $t('pages.encounter.update.ac') }}</h2>
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
              type="button"
              class="btn-black"
              :aria-label="isRollingDice ? $t('actions.rollHide') : $t('actions.roll')"
              @click="isRollingDice = !isRollingDice"
            >
              {{ isRollingDice ? $t('actions.rollHide') : $t('actions.roll') }}
            </button>
          </div>
        </div>
        <DiceRolling v-if="isRollingDice" @result="diceResult" />
        <button
          type="submit"
          class="btn-black w-full mt-3"
          :aria-label="$t('actions.update')"
        >
          {{ $t('actions.update') }}
        </button>
      </FormKit>
    </Modal>
  </div>
</template>
