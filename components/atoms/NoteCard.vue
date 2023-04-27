<script setup>
import { useToastStore } from '@/store/toast'
import { useNotesStore } from '@/store/notes'

const emit = defineEmits(['deleted', 'updated'])
const props = defineProps({ note: { type: Object, required: true } })

const toast = useToastStore()
const store = useNotesStore()

const isSettings = ref(false)
const isUpdating = ref(false)
const needConfirmation = ref(false)

async function deleteNote () {
  try {
    await store.deleteNote(props.note.id)
    emit('deleted', props.note.id)
  } catch (err) {
    useBugsnag().notify(`Handeld in catch: ${err}`)
    toast.error()
  }
}

function updateNote (note) {
  emit('updated', note)
  isSettings.value = false
  isUpdating.value = false
}
</script>

<template>
  <section class="rounded-xl w-fit bg-black p-3 relative space-y-1 tracker-shadow group min-w-[250px]">
    <div class="flex gap-2 items-center justify-between">
      <h3 v-if="note.title">
        {{ note.title }}
      </h3>
      <Icon
        v-if="!isSettings"
        v-tippy="{ content: $t('actions.openSettings'), animation: 'shift-away' }"
        name="material-symbols:settings-outline-rounded"
        class="w-6 h-6 cursor-pointer text-primary opacity-0 group-hover:opacity-100 duration-200 ease-in-out"
        @click="isSettings = !isSettings"
      />
      <Icon
        v-else
        v-tippy="{ content: $t('actions.closeSettings'), animation: 'shift-away' }"
        name="ic:round-clear"
        class="w-6 h-6 cursor-pointer text-primary"
        @click="isSettings = false"
      />
    </div>
    <p class="pt-2">
      {{ note.text }}
    </p>
    <div v-if="isSettings" class="flex flex-col gap-2 pt-4">
      <div class="flex gap-2 cursor-pointer max-w-max" @click="isUpdating = true">
        <Icon name="lucide:wrench" class="h-6 w-6" />
        <p>{{ $t('actions.update') }}</p>
      </div>
      <div class="flex gap-2 cursor-pointer max-w-max" @click="needConfirmation = true">
        <Icon name="material-symbols:delete-outline-rounded" class="h-6 w-6" />
        <p>{{ $t('actions.delete') }}</p>
      </div>
    </div>
    <ConfirmationModal
      :open="needConfirmation"
      :title="note.title || 'Campaign note'"
      @close="needConfirmation = false"
      @delete="deleteNote"
    />
    <UpdateNote :open="isUpdating" :note="note" @close="isUpdating = false" @updated="updateNote" />
  </section>
</template>
