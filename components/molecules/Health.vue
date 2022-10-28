<script setup>
import Update from '@/assets/icons/update.svg'

const emit = defineEmits(['update'])
const props = defineProps({
  health: { type: [Number, null, String], required: true },
  tempHealth: { type: [Number, null, String], required: true },
})

const isOpen = ref(false)
const isRollingDice = ref(false)
const form = reactive({ health: null })

function diceResult(amount) {
  form.health = amount
}

function updateAc(data) {
  const { __init, health } = data
  emit('update', Number(health))
  isOpen.value = false
  isRollingDice.value = false
}
</script>

<template>
  <div>
    <div class="flex gap-2">
      <div class="peer cursor-pointer" @click="isOpen = true">
        <p v-if="health !== null" :class="{ 'text-danger font-bold': health < 1 }">{{ health }}</p>
        <span v-if="tempHealth" class="text-primary">+{{ tempHealth }}</span>
      </div>
      <Update class="w-4 h-4 opacity-0 peer-hover:opacity-100 duration-200 ease-in-out" />
    </div>
    <Modal v-if="isOpen" @close="isOpen = false">
      <h2>{{ $t('encounter.update.hp') }}</h2>
      <FormKit v-model="form" type="form" :actions="false" message-class="error-message" @submit="updateAc">
        <div class="flex gap-2 items-end">
          <div class="grow">
            <Input
              name="health"
              type="number"
              :label="$t('inputs.hpLabel')"
              validation="required|between:1,1000|number"
              required
            />
          </div>
          <div class="mb-3">
            <Button
              :label="isRollingDice ? $t('encounter.rollHide') : $t('actions.roll')"
              bold
              @click="isRollingDice = !isRollingDice"
            />
          </div>
        </div>
        <DiceRolling v-if="isRollingDice" @result="diceResult" />
        <Button type="submit" :label="$t('actions.update')" inline bold />
      </FormKit>
    </Modal>
  </div>
</template>
