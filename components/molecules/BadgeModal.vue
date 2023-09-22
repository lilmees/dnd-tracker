<script setup lang="ts">
import { reset } from '@formkit/core'

const badge = useBadgesStore()

const isOpen = ref<boolean>(false)

async function handleSubmit ({ code, ...formData }: Obj): Promise<void> {
  const success = await badge.addBadge(code)
  success ? resetState() : reset('form')
}

function resetState (): void {
  reset('form')
  badge.loading = false
  badge.error = undefined
  isOpen.value = false
}
</script>

<template>
  <TextButton @click="isOpen = true">
    {{ $t('components.badgeModal.claim') }}
  </TextButton>
  <Modal v-if="isOpen" @close="resetState">
    <template #header>
      <h2>
        {{ $t('components.badgeModal.title') }}
      </h2>
    </template>
    <p v-if="badge.error" class="text-danger text-center">
      {{ badge.error }}
    </p>
    <FormKit
      id="form"
      type="form"
      :actions="false"
      @submit="handleSubmit"
    >
      <FormKit
        name="code"
        :label="$t('components.inputs.codeLabel')"
        validation="required|length:3,30"
      />
      <FormKit
        type="submit"
        :aria-label="$t('components.badgeModal.add')"
        :label="$t('components.badgeModal.add')"
        :disabled="badge.loading"
      />
    </FormKit>
  </Modal>
</template>
