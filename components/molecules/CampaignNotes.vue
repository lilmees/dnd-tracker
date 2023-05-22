<script setup lang="ts">
import { useCurrentCampaignStore } from '@/store/currentCampaign'

const store = useCurrentCampaignStore()

const isOpen: Ref<boolean> = ref(false)

function addedNote (notes: Note[]): void {
  if (store.campaign) {
    store.campaign.notes = notes
  }
  isOpen.value = false
}

function removedNote (id: number): void {
  if (store?.campaign?.notes) {
    store.campaign.notes = store.campaign.notes.filter(p => p.id !== id)
  }
  isOpen.value = false
}

function updatedNote (note: Note): void {
  if (store?.campaign?.notes) {
    const index = store.campaign.notes.findIndex(p => p.id === note.id)
    store.campaign.notes[index] = note
  }
  isOpen.value = false
}
</script>

<template>
  <section class="space-y-4">
    <div class="flex justify-between border-b border-slate-700 pb-1">
      <h2>{{ $t('general.notes') }}</h2>
      <Icon
        v-tippy="{ content: $t('actions.add'), animation: 'shift-away' }"
        name="material-symbols:add"
        class="w-6 h-6 cursor-pointer text-success"
        @click="isOpen = true"
      />
    </div>
    <div v-if="!store?.campaign?.notes?.length" class="space-y-2">
      <p class="text-center">
        {{ $t('notes.none') }}
      </p>
      <button
        class="btn-primary w-fit mx-auto"
        :aria-label="$t('notes.add')"
        @click="isOpen = true"
      >
        {{ $t('notes.add') }}
      </button>
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
      v-if="store.campaign"
      :id="store.campaign.id"
      :open="isOpen"
      :notes="store?.campaign?.notes || []"
      @close="isOpen = false"
      @notes="addedNote"
    />
  </section>
</template>
