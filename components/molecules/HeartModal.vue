<script setup>
import Heart from '@/assets/icons/heart.svg'

const emit = defineEmits(['update'])
const props = defineProps({
  health: { type: [Number, null, String], required: true },
  tempHealth: { type: [Number, null, String], required: true },
})

const isOpen = ref(false)
const isRollingDice = ref(false)
const type = ref()
const form = reactive({ health: null })

function diceResult(amount) {
  form.health = amount
}

function updateHealth(data) {
  const { __init, health } = data
  emit('update', { type: type.value, amount: Number(health) })
  isOpen.value = false
  isRollingDice.value = false
  type.value = null
}
</script>

<template>
  <div>
    <Heart class="w-6 h-6 cursor-pointer text-danger" @click="isOpen = true" />
    <Modal v-if="isOpen" @close="isOpen = false">
      <h2>{{ $t('encounter.update.hp') }}</h2>
      <FormKit v-model="form" type="form" :actions="false" message-class="error-message" @submit="updateHealth">
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
        <div class="flex gap-2 flex-wrap">
          <div class="grow" @click="type = 'heal'">
            <Button type="submit" :label="$t('encounter.heal')" bold inline color="success" />
          </div>
          <div class="grow" @click="type = 'temp'">
            <Button type="submit" :label="$t('encounter.temp')" bold inline color="primary" />
          </div>
          <div class="grow" @click="type = 'damage'">
            <Button type="submit" :label="$t('encounter.damage')" bold inline color="danger" />
          </div>
          <div class="grow" @click="type = 'base'">
            <Button type="submit" :label="$t('encounter.baseHealth')" bold inline color="warning" />
          </div>
        </div>
      </FormKit>
    </Modal>
  </div>
</template>
