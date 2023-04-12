<script setup>
import { useCurrentCampaignStore } from '@/store/currentCampaign'
import Add from '~/assets/icons/add.svg'

definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const store = useCurrentCampaignStore()

const isCreatingEncounter = ref(false)

onMounted(() => store.getCampaignInfo(route.params.id))

function addedEncounter (encounter) {
  store.encounters.push(encounter)
  isCreatingEncounter.value = false
}

function deletedEncounter (id) {
  store.encounters = store.encounters.filter(e => e.id !== id)
  isCreatingEncounter.value = false
}

function updatedEncounter (encounter) {
  const index = store.encounters.findIndex(e => e.id === encounter.id)
  store.encounters[index] = encounter
}
</script>

<template>
  <NuxtLayout>
    <div v-if="store.loading" class="loader" />
    <div v-else-if="store.campaign" class="py-4 space-y-4 mt-10 mb-20">
      <Back url="campaigns" :label="$t('campaign.back')" class="sm:hidden" />
      <div
        class="rounded w-full tracker-shadow relative p-2 flex"
        :style="{
          'background-color': store.campaign.background || '#000',
          color: store.campaign.color || '#fff'
        }"
      >
        <h1 class="grow text-center">
          {{ store.campaign.title }}
        </h1>
        <Back
          url="campaigns"
          :label="$t('campaign.back')"
          class="hidden sm:block absolute right-4 top-1/2 -translate-y-1/2"
          :color="store.campaign.color || '#fff'"
        />
      </div>
      <div class="space-y-8 pt-10">
        <div class="space-y-4">
          <div class="flex justify-between border-b border-slate-700 pb-1">
            <h2>{{ $t('general.encounters') }}</h2>
            <Add
              v-tippy="{ content: $t('actions.add'), animation: 'shift-away' }"
              class="w-4 h-4 cursor-pointer hover:scale-110 duration-200 ease-in-out text-success"
              @click="isCreatingEncounter = true"
            />
          </div>
          <div v-if="store.encounters.length" class="flex flex-wrap gap-4 items-start">
            <EncounterCard
              v-for="encounter in store.encounters"
              :key="encounter.id"
              :encounter="encounter"
              @deleted="deletedEncounter"
              @copied="addedEncounter"
              @updated="updatedEncounter"
            />
          </div>
          <div v-else class="space-y-2">
            <p class="text-center">
              {{ $t('encounters.noData.title') }}
            </p>
            <Button
              :label="$t('encounters.add')"
              color="primary"
              bold
              class="mx-auto w-fit"
              @click="isCreatingEncounter = true"
            />
          </div>
        </div>
      </div>
      <HomebrewTable class="py-10" />
      <!-- <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8 py-8">
        <CampaignPlayers v-model="store.campaign.players" :id="store.campaign.id" />
        <CampaignMonsters v-model="store.campaign['homebrew-monsters']" :id="store.campaign.id" />
      </div> -->
      <CampaignNotes :id="store.campaign.id" v-model="store.campaign.notes" />
      <AddEncounterModal
        :open="isCreatingEncounter"
        :campaign-id="store.campaign.id"
        @close="isCreatingEncounter = false"
        @added="addedEncounter"
      />
    </div>
  </NuxtLayout>
</template>
