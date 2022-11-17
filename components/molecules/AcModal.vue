<script setup>
import Shield from '@/assets/icons/shield.svg'

const emit = defineEmits(['update'])
const props = defineProps({
  ac: { type: [Number, null, String], required: true },
  tempAc: { type: [Number, null, String], required: true },
})

const isOpen = ref(false)
const isRollingDice = ref(false)
const type = ref()
const form = ref({ ac: null })

function diceResult(amount) {
  form.value.ac = amount
}

function updateAc({ __init, ac }) {
  emit('update', { type: type.value, amount: Number(ac) })
  resetState()
}

function resetAc() {
  emit('update', { type: 'reset' })
  resetState()
}

function resetState() {
  isOpen.value = false
  isRollingDice.value = false
  type.value = null
}
</script>

<template>
  <div>
    <Shield class="w-6 h-6 cursor-pointer text-help" @click="isOpen = true" />
    <Modal v-if="isOpen" @close="isOpen = false">
      <h2>{{ $t('encounter.update.ac') }}</h2>
      <FormKit v-model="form" type="form" :actions="false" message-class="error-message" @submit="updateAc">
        <div class="flex gap-2 items-end">
          <div class="grow">
            <Input
              name="ac"
              type="number"
              :label="$t('inputs.acLabel')"
              validation="required|between:1,100|number"
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
          <div class="grow" @click="resetAc">
            <Button :label="$t('actions.reset')" bold inline color="success" />
          </div>
          <div class="grow" @click="type = 'temp'">
            <Button type="submit" :label="$t('actions.temp')" bold inline color="primary" />
          </div>
          <div class="grow" @click="type = 'remove'">
            <Button type="submit" :label="$t('actions.remove')" bold inline color="danger" />
          </div>
          <div class="grow" @click="type = 'base'">
            <Button type="submit" :label="$t('actions.baseAc')" bold inline color="warning" />
          </div>
        </div>
      </FormKit>
    </Modal>
  </div>
</template>
