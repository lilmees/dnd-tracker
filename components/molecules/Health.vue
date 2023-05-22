<script setup lang="ts">
const emit = defineEmits(['update'])
defineProps<{
  health: number | null | string,
  tempHealth: number | null | string,
  type: string
}>()

const isOpen: Ref<boolean> = ref(false)
const isRollingDice: Ref<boolean> = ref(false)
const form: Ref<{ health: number | null }> = ref({ health: null })

function diceResult (amount: number): void {
  form.value.health = amount
}

function updateHealth ({ __init, health }: Obj): void {
  emit('update', Number(health))
  isOpen.value = false
  isRollingDice.value = false
}
</script>

<template>
  <div>
    <div class="flex gap-2 items-center">
      <div class="peer cursor-pointer flex gap-1" @click="isOpen = true">
        <p v-if="health !== null" :class="{ 'text-danger font-bold': +health < 1 }">
          {{ health }}
        </p>
        <p v-else-if="type !== 'lair'" class="text-slate-600">
          Add
        </p>
        <span v-if="health !== null && tempHealth" class="text-primary">+{{ tempHealth }}</span>
      </div>
      <Icon
        name="lucide:wrench"
        class="w-4 h-4 opacity-0 peer-hover:opacity-100 duration-200 ease-in-out"
        :class="{ hidden: !health }"
      />
    </div>
    <Modal v-if="isOpen" @close="isOpen = false">
      <h2>{{ $t('encounter.update.hp') }}</h2>
      <FormKit
        v-model="form"
        type="form"
        :actions="false"

        @submit="updateHealth"
      >
        <div class="flex gap-2 items-end">
          <div class="grow">
            <Input
              focus
              name="health"
              type="number"
              :label="$t('inputs.hpLabel')"
              validation="required|between:1,1000|number"
              required
            />
          </div>
          <button
            class="btn-black mb-3"
            :aria-label="isRollingDice ? $t('actions.rollHide') : $t('actions.roll')"
            @click="isRollingDice = !isRollingDice"
          >
            {{ isRollingDice ? $t('actions.rollHide') : $t('actions.roll') }}
          </button>
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
