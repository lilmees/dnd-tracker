<script setup>
import Update from '@/assets/icons/update.svg'

const emit = defineEmits(['update'])
const props = defineProps({ initiative: { type: [Number, null], required: true } })

const isOpen = ref(false)
const isRollingDice = ref(false)
const form = reactive({ name: null })

function diceResult(amount) {
  form.initiative = amount
}

function updateInitiative({ __init, initiative }) {
  emit('update', Number(initiative))
  isOpen.value = false
  isRollingDice.value = false
}
</script>

<template>
  <div>
    <div class="flex gap-2 items-center">
      <p v-if="initiative" class="peer cursor-pointer" @click="isOpen = true">
        {{ initiative }}
      </p>
      <div
        v-else
        class="max-w-max px-2 py-1 rounded bg-black cursor-pointer tracker-shadow font-bold"
        @click="isOpen = true"
      >
        {{ $t('encounter.addInitiative') }}
      </div>
      <Update class="w-4 h-4 opacity-0 peer-hover:opacity-100 duration-200 ease-in-out" />
    </div>
    <Modal v-if="isOpen" @close="isOpen = false">
      <h2>{{ $t('encounter.update.initiative') }}</h2>
      <FormKit v-model="form" type="form" :actions="false" message-class="error-message" @submit="updateInitiative">
        <div class="flex gap-2 items-end">
          <div class="grow">
            <Input
              name="initiative"
              :label="$t('inputs.initiativeLabel')"
              validation="required|between:1,50|number"
              type="number"
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
