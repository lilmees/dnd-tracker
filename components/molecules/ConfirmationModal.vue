<script setup>
const emit = defineEmits(['close', 'delete'])
const props = defineProps({
  open: { type: Boolean, required: true },
  title: { type: String, required: true },
})

const form = ref({ title: '' })
const same = computed(() => props.title === form.value.title)

function deleteConfirmation() {
  if (form.value.title.trim() !== props.title.trim()) return
  emit('delete')
}
</script>

<template>
  <Modal v-if="open" @close="$emit('close')">
    <div class="text-white space-y-4">
      <h2>{{ $t('confirmation.title') }}</h2>
      <p class="font-bold text-danger pb-4">{{ $t('confirmation.text', { title }) }}</p>
      <FormKit v-model="form" type="form" :actions="false" message-class="error-message" @submit="deleteConfirmation">
        <Input
          focus
          name="title"
          :label="$t('inputs.titleLabel')"
          validation="required"
          required
          :placeholder="title"
        />
        <Button type="submit" :label="$t('actions.delete')" color="danger" inline :disabled="!same" />
      </FormKit>
    </div>
  </Modal>
</template>
