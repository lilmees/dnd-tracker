<script setup lang="ts">
import { reset } from '@formkit/core'

const emit = defineEmits(['update', 'close'])

const isRollingDice = ref<boolean>(false)
const form = ref<{ health: number | null }>({ health: null })

function updateHealth({ __init, health }: Obj): void {
  emit('update', Number(health))
  reset('form')
  isRollingDice.value = false
}
</script>

<template>
  <Modal @close="$emit('close')">
    <template #header>
      <h2>{{ $t('pages.encounter.update.hp') }}</h2>
    </template>
    <FormKit
      id="form"
      v-model="form"
      type="form"
      :actions="false"
      @submit="updateHealth"
    >
      <FormKit
        name="health"
        type="number"
        :label="$t('components.inputs.hpLabel')"
        :help="$t('general.alsoMax', { field: 'HP' })"
        validation="required|between:1,1000|number"
        :suffix-icon="isRollingDice ? 'close' : 'dice'"
        @suffix-icon-click="isRollingDice = !isRollingDice"
      />
      <DiceRolling
        :show="isRollingDice"
        @result="(v) => {
          form.health = v
          isRollingDice = false
        }"
      />
      <InlineConfirmation>
        <template #submit>
          <FormKit
            type="submit"
            :label="$t('actions.update')"
            :aria-label="$t('actions.update')"
            outer-class="$reset !mb-0"
          />
        </template>
      </InlineConfirmation>
    </FormKit>
  </Modal>
</template>
