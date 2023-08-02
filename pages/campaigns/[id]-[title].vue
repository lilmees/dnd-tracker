<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const store = useCurrentCampaignStore()

const isCreatingEncounter = ref<boolean>(false)

onMounted(() => {
  if (route?.params?.id) {
    store.getCampaignInfo(+route.params.id)
  }
})

function addedEncounter (encounter: Encounter): void {
  store.encounters.push(encounter)
  isCreatingEncounter.value = false
}

function deletedEncounter (id: number): void {
  store.encounters = store.encounters.filter(e => e.id !== id)
  isCreatingEncounter.value = false
}

function updatedEncounter (encounter: Encounter): void {
  const index = store.encounters.findIndex(e => e.id === encounter.id)
  store.encounters[index] = encounter
}
</script>

<template>
  <NuxtLayout>
    <div class="py-4 space-y-4">
      <div class="flex justify-end">
        <Back url="campaigns" :label="$t('pages.campaign.back')" class="sm:hidden" />
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
            url="campaigns"
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
              v-tippy="{ content: $t('actions.add'), animation: 'shift-away' }"
              name="material-symbols:add"
              class="w-6 h-6 cursor-pointer text-success"
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
              @deleted="deletedEncounter"
              @copied="addedEncounter"
              @updated="updatedEncounter"
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
      <AddEncounterModal
        v-if="store.campaign"
        :open="isCreatingEncounter"
        :campaign-id="store.campaign.id"
        @close="isCreatingEncounter = false"
        @added="addedEncounter"
      />
    </div>
  </NuxtLayout>
</template>
