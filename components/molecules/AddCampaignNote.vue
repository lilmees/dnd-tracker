<script setup>
import { reset } from '@formkit/core'
import { useNotesStore } from '@/store/notes'

const emit = defineEmits(['close', 'notes'])
const props = defineProps({
  notes: { type: Array, required: true },
  open: { type: Boolean, required: true },
  id: { type: Number, required: true },
})

const store = useNotesStore()

const error = ref()
const isLoading = ref(false)
const form = ref({ title: null, text: null })

async function addNote({ __init, ...formData }) {
  error.value = null
  try {
    isLoading.value = true
    const note = await store.addNote({ ...formData, campaign: props.id }, props.id)
    emit('notes', [...props.notes, note])
    reset('form')
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Modal v-if="open" @close="$emit('close')">
    <p v-if="error" class="text-danger text-center">{{ error }}</p>
    <FormKit id="form" v-model="form" type="form" :actions="false" message-class="error-message" @submit="addNote">
      <Input name="title" :label="$t('inputs.titleLabel')" required validation="required|length:3,50" />
      <Input
        name="text"
        type="textarea"
        :label="$t('inputs.textLabel')"
        required
        validation="required|length:10,1000"
      />
      <Button type="submit" :label="$t('notes.add')" :loading="isLoading" inline bold />
    </FormKit>
  </Modal>
</template>
