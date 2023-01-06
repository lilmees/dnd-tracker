<script setup>
import { useToastStore } from '@/store/toast'
import { useI18n } from 'vue-i18n'
import { useNotesStore } from '@/store/notes'
import Settings from '@/assets/icons/settings.svg'
import Delete from '@/assets/icons/delete.svg'
import Update from '@/assets/icons/update.svg'
import Remove from '@/assets/icons/remove.svg'

const emit = defineEmits(['deleted', 'updated'])
const props = defineProps({ note: { type: Object, required: true } })

const toast = useToastStore()
const { t } = useI18n({ useScope: 'global' })
const store = useNotesStore()

const isSettings = ref(false)
const isUpdating = ref(false)
const needConfirmation = ref(false)

async function deleteNote() {
  try {
    await store.deleteNote(props.note.id)
    emit('deleted', props.note.id)
  } catch (error) {
    toast.error({ title: t('error.general.title'), text: t('error.general.text') })
  }
}

async function updateNote(note) {
  emit('updated', note)
  isSettings.value = false
  isUpdating.value = false
}
</script>

<template>
  <section class="rounded-xl w-fit bg-black p-3 relative space-y-1 tracker-shadow group">
    <div class="flex gap-2 items-center justify-between">
      <h3 v-if="note.title">{{ note.title }}</h3>
      <Settings
        v-if="!isSettings"
        v-tooltip="$t('actions.openSettings')"
        @click="isSettings = !isSettings"
        class="w-4 h-4 cursor-pointer text-primary opacity-0 group-hover:opacity-100 duration-200 ease-in-out"
      />
      <Remove
        v-else
        v-tooltip="$t('actions.closeSettings')"
        class="w-8 h-8 cursor-pointer text-primary"
        @click="isSettings = false"
      />
    </div>
    <p class="pt-2">
      {{ note.text }}
    </p>
    <div v-if="isSettings" class="flex flex-col gap-2 pt-4">
      <div class="flex gap-2 cursor-pointer max-w-max" @click="isUpdating = true">
        <Update class="h-6 w-6" />
        <p>{{ $t('actions.update') }}</p>
      </div>
      <div class="flex gap-2 cursor-pointer max-w-max" @click="needConfirmation = true">
        <Delete class="h-6 w-6" />
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
