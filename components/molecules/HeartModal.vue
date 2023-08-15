<script setup lang="ts">
const emit = defineEmits(['update'])
defineProps<{
  health: number | undefined,
  tempHealth: number | undefined
}>()

const isOpen = ref<boolean>(false)
const isRollingDice = ref<boolean>(false)
const type = ref<string | null>(null)
const form = ref<{ health: number | null }>({ health: null })

function diceResult (amount: number): void {
  form.value.health = amount
}

function updateHealth ({ __init, health }: Obj): void {
  emit('update', { type: type.value || 'heal', amount: Number(health) })
  isOpen.value = false
  isRollingDice.value = false
  type.value = null
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
      <h2>{{ $t('pages.encounter.update.hp') }}</h2>
      <FormKit
        v-model="form"
        type="form"
        :actions="false"

        @submit="updateHealth"
      >
        <div class="flex gap-2 items-end mb-3">
          <div class="grow">
            <Input
              focus
              name="health"
              type="number"
              :label="$t('components.inputs.hpLabel')"
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
        <div class="flex gap-2 flex-wrap pt-3">
          <button
            type="submit"
            class="btn-success grow"
            :aria-label="$t('actions.heal')"
            @click="type = 'heal'"
          >
            {{ $t('actions.heal') }}
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
            :aria-label="$t('actions.damage')"
            @click="type = 'damage'"
          >
            {{ $t('actions.damage') }}
          </button>
          <button
            type="submit"
            class="btn-warning grow"
            :aria-label="$t('actions.baseHealth')"
            @click="type = 'base'"
          >
            {{ $t('actions.baseHealth') }}
          </button>
        </div>
      </FormKit>
    </Modal>
  </div>
</template>
