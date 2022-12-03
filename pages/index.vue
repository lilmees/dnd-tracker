<script setup>
import encounterJson from '@/fixtures/homePageEncounter.json'

const encounter = ref(encounterJson)

function resetRounds() {
  encounter.value.round = 1
  encounter.value.activeIndex = 0
}

function nextInitiative() {
  if (encounter.value.activeIndex + 1 < encounter.value.rows.length) encounter.value.activeIndex++
  else {
    encounter.value.activeIndex = 0
    encounter.value.round = encounter.value.round + 1
  }
}

function updateRows(rows) {
  encounter.value.rows = rows
}
</script>

<template>
  <NuxtLayout name="wide">
    <div>
      <Hero />
      <div class="flex flex-col gap-y-20 py-20 px-4 container-max">
        <TitleText />
        <EncounterHeader
          class="w-full"
          :round="encounter.round"
          :title="encounter.title"
          @next="nextInitiative"
          @reset="resetRounds"
        />
        <EncounterTable :rows="encounter.rows" :activeIndex="encounter.activeIndex" showcase @update="updateRows" />
      </div>
    </div>
  </NuxtLayout>
</template>
