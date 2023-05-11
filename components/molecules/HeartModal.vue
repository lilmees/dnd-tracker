<script setup lang="ts">
const emit = defineEmits(['update'])
defineProps<{
  health: number | undefined,
  tempHealth: number | undefined
}>()

const isOpen: Ref<boolean> = ref(false)
const isRollingDice : Ref<boolean> = ref(false)
const type: Ref<string | null> = ref(null)
const form: Ref<{ health: number | null }> = ref({ health: null })

function diceResult (amount: number): void {
  form.value.health = amount
}

function updateHealth ({ __init, health }: Obj): void {
  emit('update', { type: type.value, amount: Number(health) })
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
            <Button
              type="submit"
              :label="$t('actions.heal')"
              inline
              color="success"
            />
          </div>
          <div class="grow" @click="type = 'temp'">
            <Button
              type="submit"
              :label="$t('actions.temp')"
              inline
              color="primary"
            />
          </div>
          <div class="grow" @click="type = 'damage'">
            <Button
              type="submit"
              :label="$t('actions.damage')"
              inline
              color="danger"
            />
          </div>
          <div class="grow" @click="type = 'base'">
            <Button
              type="submit"
              :label="$t('actions.baseHealth')"
              inline
              color="warning"
            />
          </div>
        </div>
      </FormKit>
    </Modal>
  </div>
</template>
