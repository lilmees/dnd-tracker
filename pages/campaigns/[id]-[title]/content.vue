<script setup lang="ts">
import logRocket from 'logrocket'

const store = useCurrentCampaignStore()
const profile = useProfileStore()
const encStore = useEncountersStore()
const toast = useToastStore()

const {
  isUpdating,
  needConfirmation,
  selected,
  reset
} = useBulkEditing()

const isCreatingEncounter = ref<boolean>(false)

function addedEncounter (encounter: Encounter): void {
  store.encounters.push(encounter)
  resetState()
}

async function deletedEncounter (): Promise<void> {
  try {
    store.encounters = store.encounters.filter(e => e.id !== selected.value[0].id)
    await encStore.deleteEncounter(selected.value[0].id)
  } catch (err) {
    logRocket.captureException(err as Error)
    toast.error()
  } finally {
    resetState()
  }
}

function updatedEncounter (encounter: Encounter): void {
  const index = store.encounters.findIndex(e => e.id === encounter.id)
  store.encounters[index] = encounter
  resetState()
}

async function copyEncounter (enc : Encounter): Promise<void> {
  try {
    const copy = await encStore.copyEncounter(enc)

    if (copy) {
      store.encounters.push(copy)
    }
  } catch (err) {
    logRocket.captureException(err as Error)
    toast.error()
  } finally {
    resetState()
  }
}

function resetState (): void {
  reset()
  isCreatingEncounter.value = false
}
</script>

<template>
  <div class="space-y-4">
    <div class="space-y-8">
      <div class="space-y-4">
        <div class="flex justify-between border-b-2 border-slate-700 pb-1">
          <h2>{{ $t('general.encounters') }}</h2>
          <div class="flex gap-4 items-center">
            <span class="text-[10px]">
              {{ $t('general.globally') }}
            </span>
            <div
              class="body-small"
              :class="{
                'text-danger': encStore.data.length >= encStore.max
              }"
            >
              {{ encStore.data.length }} / {{ encStore.max }}
            </div>
            <button
              v-tippy="{ content: $t('actions.add') }"
              :aria-label="$t('actions.add')"
              class="disabled:opacity-40 disabled:cursor-not-allowed"
              :disabled="!store.campaign || !isAdmin(store.campaign, profile.data?.id || '') || encStore.max <= encStore.data.length"
              @click="isCreatingEncounter = true"
            >
              <Icon
                name="material-symbols:add"
                class="w-6 h-6 text-success"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
        <div
          v-if="store.loading"
          class="flex flex-wrap gap-4 items-start"
        >
          <SkeletonEncounterCard v-for="i in 4" :key="i" />
        </div>
        <template
          v-else-if="store.encounters.length"
        >
          <LimitCta v-if="encStore.max <= encStore.data.length" class="mb-10" />
          <div class="flex flex-wrap gap-4 items-start">
            <EncounterCard
              v-for="encounter in store.encounters"
              :key="encounter.id"
              :encounter="encounter"
              :disable-copy="encStore.max <= encStore.data.length"
              @update="(v: Encounter) => {
                selected = [v];
                isUpdating = true
              }"
              @remove="(v: Encounter) => {
                selected = [v];
                needConfirmation = true
              }"
              @copy="copyEncounter"
              @share="encStore.shareEncounter"
            />
          </div>
        </template>
        <NoContent v-else content="encounters" icon="ri:table-line" />
      </div>
    </div>
    <HomebrewTable class="py-10" />
    <CampaignNotes />
    <div class="absolute z-[1]">
      <ConfirmationModal
        v-if="selected.length"
        :open="needConfirmation"
        :title="selected[0].title"
        @close="resetState"
        @delete="deletedEncounter"
      />
      <EncounterModal
        v-if="store.campaign"
        :open="isCreatingEncounter || isUpdating"
        :update="isUpdating"
        :campaign-id="store.campaign.id"
        :encounter="isUpdating && selected.length ? selected[0] : undefined"
        @added="addedEncounter"
        @close="resetState"
        @updated="updatedEncounter"
      />
    </div>
  </div>
</template>
