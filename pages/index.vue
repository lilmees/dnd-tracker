<script setup>
import { useEncountersStore } from '@/store/encounters'

const store = useEncountersStore()
const encounter = ref()

onMounted(() => getEncounter())

async function getEncounter() {
  try {
    encounter.value = await store.getSandboxEncounter()
  } catch (err) {
    console.error(err)
  }
}

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
</script>

<template>
  <NuxtLayout name="wide">
    <div>
      <Hero />
      <div class="flex flex-col gap-y-[100px] sm:gap-y-[150px] py-20 px-4 container-max">
        <div class="container grid grid-cols-1 lg:grid-cols-2">
          <TitleText
            :title="$t('home.textBlock1.title')"
            :text="$t('home.textBlock1.text')"
            buttonLink="roadmap"
            :buttonLabel="'Go to the roadmap'"
          />
          <div class="mt-20 lg:mt-32 flex justify-end">
            <Summary
              :title="$t('home.summary.title')"
              :items="[
                $t('home.summary.item1'),
                $t('home.summary.item2'),
                $t('home.summary.item3'),
                $t('home.summary.item4'),
                $t('home.summary.item5'),
                $t('home.summary.item6'),
              ]"
            />
          </div>
        </div>
        <div v-if="encounter" v-motion-slide-visible-bottom class="rounded-xl px-4 bg-tracker tracker-shadow">
          <EncounterHeader
            class="w-full pb-4"
            :round="encounter.round"
            :title="encounter.title"
            @next="nextInitiative"
            @reset="resetRounds"
          />
          <EncounterTable
            :rows="encounter.rows"
            :activeIndex="encounter.activeIndex"
            showcase
            @update="v => (encounter.rows = v)"
          />
          <EncounterOptions :encounter="encounter" class="pt-4" sandbox />
        </div>
        <div class="container flex justify-center items-center flex-wrap gap-x-20">
          <NuxtImg
            src="/hoard.png"
            alt="Dragon on hoard"
            sizes="sm:500px md:500px lg:500px"
            class="-scale-x-100"
            format="webp"
            provider="imagekit"
          />
          <div v-motion-slide-visible-bottom class="pt-10">
            <h2 class="pb-10 text-center">{{ $t('home.diceRoller.title') }}</h2>
            <HomeDiceRolling />
          </div>
        </div>
        <TitleText center :title="$t('home.textBlock2.title')" :text="$t('home.textBlock2.text')" />
      </div>
    </div>
  </NuxtLayout>
</template>
