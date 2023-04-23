<script setup>
const emit = defineEmits(['update'])
defineProps({
  health: { type: [Number, null, String], required: true },
  tempHealth: { type: [Number, null, String], required: true },
  type: { type: String, required: true }
})

const isOpen = ref(false)
const isRollingDice = ref(false)
const form = ref({ health: null })

function diceResult (amount) {
  form.value.health = amount
}

function updateHealth ({ __init, health }) {
  emit('update', Number(health))
  isOpen.value = false
  isRollingDice.value = false
}
</script>

<template>
  <div>
    <div class="flex gap-2 items-center">
      <div class="peer cursor-pointer flex gap-1" @click="isOpen = true">
        <p v-if="health !== null" :class="{ 'text-danger font-bold': health < 1 }">
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
        message-class="error-message"
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
          <div class="mb-3">
            <Button
              :label="isRollingDice ? $t('actions.rollHide') : $t('actions.roll')"
              bold
              @click="isRollingDice = !isRollingDice"
            />
          </div>
        </div>
        <DiceRolling v-if="isRollingDice" @result="diceResult" />
        <Button type="submit" :label="$t('actions.update')" inline />
      </FormKit>
    </Modal>
  </div>
</template>
