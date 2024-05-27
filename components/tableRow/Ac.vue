<script setup lang="ts">
import { reset } from '@formkit/core'

const emit = defineEmits(['update', 'close'])

const isRollingDice = ref<boolean>(false)
const form = ref<{ ac: number | null }>({ ac: null })

function updateAc({ __init, ac }: Obj): void {
  emit('update', Number(ac))
  reset('form')
  isRollingDice.value = false
}
</script>

<template>
  <Modal @close="$emit('close')">
    <template #header>
      <h2>{{ $t('pages.encounter.update.ac') }}</h2>
    </template>
    <FormKit
      v-model="form"
      type="form"
      :actions="false"
      @submit="updateAc"
    >
      <FormKit
        name="ac"
        type="number"
        :label="$t('components.inputs.acLabel')"
        :help="$t('general.alsoMax', { field: 'AC' })"
        validation="required|between:1,100|number"
        :suffix-icon="isRollingDice ? 'close' : 'dice'"
        @suffix-icon-click="isRollingDice = !isRollingDice"
      />
      <DiceRolling
        :show="isRollingDice"
        @result="(v) => {
          form.ac = v
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
