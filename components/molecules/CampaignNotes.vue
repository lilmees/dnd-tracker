<script setup>
import Add from '~/assets/icons/add.svg'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: { type: Array, required: true },
  id: { type: Number, required: true },
})

const isOpen = ref(false)

function addedNote(notes) {
  emitAndResetState(notes)
}

function removedNote(id) {
  emitAndResetState(props.modelValue.filter(p => p.id !== id))
}

function updatedNote(note) {
  const index = props.modelValue.findIndex(p => p.id === note.id)
  const notes = props.modelValue
  notes[index] = note
  emitAndResetState(notes)
}

function emitAndResetState(state) {
  emit('update:modelValue', state)
  isOpen.value = false
}
</script>

<template>
  <section class="space-y-4">
    <div class="flex justify-between border-b border-slate-700 pb-1">
      <h2>{{ $t('general.notes') }}</h2>
      <Add
        v-tippy="$t('actions.add')"
        @click="isOpen = true"
        class="w-4 h-4 cursor-pointer hover:scale-110 duration-200 ease-in-out text-success"
      />
    </div>
    <div v-if="!modelValue.length" class="space-y-2">
      <p class="text-center">{{ $t('notes.none') }}</p>
      <Button :label="$t('notes.add')" color="primary" class="mx-auto w-fit" @click="isOpen = true" />
    </div>
    <div v-else class="flex gap-2 flex-wrap items-start">
      <NoteCard
        v-for="note in modelValue"
        :key="note.created_at"
        :note="note"
        @deleted="removedNote"
        @updated="updatedNote"
      />
    </div>
    <AddCampaignNote :open="isOpen" :id="id" :notes="modelValue" @close="isOpen = false" @notes="addedNote" />
  </section>
</template>
