<script setup lang="ts">
import { reset } from '@formkit/core'

const emit = defineEmits(['update', 'close'])

const form = ref<{ name: string }>({ name: '' })

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
      v-model="form"
      type="form"
      :actions="false"
      @submit="updateName"
    >
      <FormKit
        name="name"
        :label="$t('components.inputs.nameLabel')"
        validation="required|length:3,30"
        suffix-icon="random"
        @suffix-icon-click="() => {
          form.name = useRandomName()
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
