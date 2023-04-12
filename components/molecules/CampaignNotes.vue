<script setup>
import { useCurrentCampaignStore } from '@/store/currentCampaign'
import Add from '~/assets/icons/add.svg'

const emit = defineEmits(['update:modelValue'])

const store = useCurrentCampaignStore()

const isOpen = ref(false)

function addedNote (notes) {
  store.campaign.notes = notes
  isOpen.value = false
}

function removedNote (id) {
  store.campaign.notes = store.campaign.notes.filter(p => p.id !== id)
  isOpen.value = false
}

function updatedNote (note) {
  const index = store.campaign.notes.findIndex(p => p.id === note.id)
  store.campaign.notes[index] = note
  isOpen.value = false
}
</script>

<template>
  <section class="space-y-4">
    <div class="flex justify-between border-b border-slate-700 pb-1">
      <h2>{{ $t('general.notes') }}</h2>
      <Add
        v-tippy="{ content: $t('actions.add'), animation: 'shift-away' }"
        class="w-4 h-4 cursor-pointer hover:scale-110 duration-200 ease-in-out text-success"
        @click="isOpen = true"
      />
    </div>
    <div v-if="!store.campaign.notes.length" class="space-y-2">
      <p class="text-center">
        {{ $t('notes.none') }}
      </p>
      <Button :label="$t('notes.add')" color="primary" class="mx-auto w-fit" @click="isOpen = true" />
    </div>
    <div v-else class="flex gap-2 flex-wrap items-start">
      <NoteCard
        v-for="note in store.campaign.notes"
        :key="note.created_at"
        :note="note"
        @deleted="removedNote"
        @updated="updatedNote"
      />
    </div>
    <AddCampaignNote
      :id="store.campaign.id"
      :open="isOpen"
      :notes="store.campaign.notes"
      @close="isOpen = false"
      @notes="addedNote"
    />
  </section>
</template>
