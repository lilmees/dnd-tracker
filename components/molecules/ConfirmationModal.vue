<script setup lang="ts">
const emit = defineEmits(['close', 'delete'])
const props = defineProps<{ open: boolean, title: string }>()

const form: Ref<{ title: string }> = ref({ title: '' })
const same: ComputedRef<boolean> = computed(() => props.title === form.value.title)

function deleteConfirmation (): void {
  if (form.value.title.trim() === props.title.trim()) {
    emit('delete')
  }
}
</script>

<template>
  <Modal v-if="open" @close="$emit('close')">
    <div class="text-white space-y-4">
      <h2 class="text-danger">
        {{ $t('confirmation.title') }}
      </h2>
      <p class="pb-4">
        {{ $t('confirmation.text', { title }) }}
      </p>
      <FormKit
        v-model="form"
        type="form"
        :actions="false"
        message-class="error-message"
        @submit="deleteConfirmation"
      >
        <Input
          focus
          name="title"
          :label="$t('inputs.titleLabel')"
          validation="required"
          required
          :placeholder="title"
        />
        <Button
          type="submit"
          :label="$t('actions.delete')"
          color="danger"
          inline
          :disabled="!same"
        />
      </FormKit>
    </div>
  </Modal>
</template>
