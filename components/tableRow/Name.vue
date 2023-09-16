<script setup lang="ts">
import { reset } from '@formkit/core'

const emit = defineEmits(['update', 'close'])

function updateName ({ __init, name }: Obj): void {
  emit('update', name.trim())
  reset('form')
}
</script>

<template>
  <Modal @close="$emit('close')">
    <template #header>
      <h2>{{ $t('pages.encounter.update.name') }}</h2>
    </template>
    <FormKit
      id="form"
      type="form"
      :actions="false"
      @submit="updateName"
    >
      <FormKit
        name="name"
        :label="$t('components.inputs.nameLabel')"
        validation="required|length:3,30"
      />
      <FormKit type="submit" :aria-label="$t('actions.update')">
        {{ $t('actions.update') }}
      </FormKit>
    </FormKit>
  </Modal>
</template>
