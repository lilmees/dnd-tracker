<script setup lang="ts">
import logRocket from 'logrocket'

definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const store = useCurrentCampaignStore()
const encStore = useEncountersStore()
const toast = useToastStore()

const {
  isUpdating,
  needConfirmation,
  selected,
  reset
} = useBulkEditing()

const isCreatingEncounter = ref<boolean>(false)

onMounted(() => {
  if (route?.params?.id) {
    store.getCampaignInfo(+route.params.id)
  }
})

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
  <NuxtLayout shadow>
    <div class="py-4 space-y-4">
      <div class="flex justify-end">
        <Back url="/campaigns" :label="$t('pages.campaign.back')" class="sm:hidden" />
      </div>
      <div
        class="rounded-lg w-full shadow p-6 flex flex-wrap justify-between items-center gap-4 border-4 bg-slate-700"
        :style="{
          'background-color': `${store.campaign?.background || '#21252E' }80`,
          color: store.campaign?.color || '#fff',
          'border-color': store.campaign?.background || '#21252E',
        }"
      >
        <h1 v-if="store.campaign" class="capitalize">
          {{ store.campaign.title }}
        </h1>
        <div
          v-else
          class="bg-background rounded-full w-[250px] h-9"
        />
        <div class="flex justify-end">
          <Back
            url="/campaigns"
            :label="$t('pages.campaign.back')"
            class="hidden sm:block"
            :color="store.campaign?.color || '#fff'"
          />
        </div>
      </div>
      <div class="space-y-8 pt-10">
        <div class="space-y-4">
          <div class="flex justify-between border-b-2 border-slate-700 pb-1">
            <h2>{{ $t('general.encounters') }}</h2>
            <Icon
              v-tippy="{ content: $t('actions.add') }"
              name="material-symbols:add"
              class="w-6 h-6 cursor-pointer text-success"
              aria-hidden="true"
              @click="isCreatingEncounter = true"
            />
          </div>
          <div
            v-if="store.loading"
            class="flex flex-wrap gap-4 items-start"
          >
            <SkeletonEncounterCard v-for="i in 4" :key="i" />
          </div>
          <div
            v-else-if="store.encounters.length"
            class="flex flex-wrap gap-4 items-start"
          >
            <EncounterCard
              v-for="encounter in store.encounters"
              :key="encounter.id"
              :encounter="encounter"
              @update="(v: Encounter) => {
                selected = [v];
                isUpdating = true
              }"
              @remove="(v: Encounter) => {
                selected = [v];
                needConfirmation = true
              }"
              @copy="copyEncounter"
            />
          </div>
          <div v-else class="space-y-4 pt-4">
            <p class="text-center">
              {{ $t('pages.encounters.noData.title') }}
            </p>
            <div class="flex justify-center">
              <button
                class="btn-primary w-fit"
                :aria-label="$t('pages.encounters.add')"
                @click="isCreatingEncounter = true"
              >
                {{ $t('pages.encounters.add') }}
              </button>
            </div>
          </div>
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
  </NuxtLayout>
</template>
