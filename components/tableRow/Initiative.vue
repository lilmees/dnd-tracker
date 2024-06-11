<script setup lang="ts">
import { reset } from '@formkit/core'

const emit = defineEmits(['update', 'close'])

const store = useTableStore()

const form = ref<{
  initiative: number | null
  amount: number | null
}>({
  initiative: store.activeRow?.initiative_modifier || null,
  amount: null,
})

function updateInitiative({ __init, initiative, amount }: Obj): void {
  if (amount < 0) {
    emit('update', -1)
  }

  const init: number = +amount + +initiative
  emit('update', init < 0 ? 0 : init)

  reset('form')
}
</script>

<template>
  <Modal @close="$emit('close')">
    <template #header>
      <h2>{{ $t('pages.encounter.update.initiative') }}</h2>
    </template>
    <FormKit
      id="form"
      v-model="form"
      type="form"
      :actions="false"
      @submit="updateInitiative"
    >
      <div class="flex gap-x-3 flex-wrap items-start">
        <FormKit
          name="amount"
          :label="$t('components.inputs.amountLabel')"
          validation="required|between:0,50|number"
          type="number"
          outer-class="grow"
          suffix-icon="dice"
          @suffix-icon-click="() => {
            form.amount = useDiceRoll(20) as number
          }"
        />
        <FormKit
          name="initiative"
          :label="`${$t('components.inputs.initiativeLabel')} (MODIFIER)`"
          validation="between:-20,20|number"
          min="-20"
          max="20"
          type="number"
          outer-class="grow"
        />
      </div>
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
