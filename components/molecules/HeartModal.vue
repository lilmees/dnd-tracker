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
const form = ref({ health: null })

function diceResult(amount) {
  form.value.health = amount
}

function updateHealth({ __init, health }) {
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
        <div class="flex gap-2 flex-wrap">
          <div class="grow" @click="type = 'heal'">
            <Button type="submit" :label="$t('actions.heal')" inline color="success" />
          </div>
          <div class="grow" @click="type = 'temp'">
            <Button type="submit" :label="$t('actions.temp')" inline color="primary" />
          </div>
          <div class="grow" @click="type = 'damage'">
            <Button type="submit" :label="$t('actions.damage')" inline color="danger" />
          </div>
          <div class="grow" @click="type = 'base'">
            <Button type="submit" :label="$t('actions.baseHealth')" inline color="warning" />
          </div>
        </div>
      </FormKit>
    </Modal>
  </div>
</template>
