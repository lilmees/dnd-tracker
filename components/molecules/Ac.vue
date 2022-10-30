<script setup>
import Update from '@/assets/icons/update.svg'

const emit = defineEmits(['update'])
const props = defineProps({
  ac: { type: [Number, null, String], required: true },
  tempAc: { type: [Number, null, String], required: true },
})

const isOpen = ref(false)
const isRollingDice = ref(false)
const form = reactive({ ac: null })

function diceResult(amount) {
  form.ac = amount
}

function updateAc(data) {
  const { __init, ac } = data
  emit('update', Number(ac))
  isOpen.value = false
  isRollingDice.value = false
}
</script>

<template>
  <div>
    <div class="flex gap-2">
      <div class="peer cursor-pointer flex gap-1" @click="isOpen = true">
        <p v-if="ac !== null">{{ ac }}</p>
        <span v-if="tempAc" class="text-primary">+{{ tempAc }}</span>
      </div>
      <Update class="w-4 h-4 opacity-0 peer-hover:opacity-100 duration-200 ease-in-out" />
    </div>
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
        <Button type="submit" :label="$t('actions.update')" inline bold />
      </FormKit>
    </Modal>
  </div>
</template>
