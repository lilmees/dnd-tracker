<script setup lang="ts">
useHead({ title: 'Playground' })

const store = useTableStore()
const route = useRoute()
const { startTour } = useTour()

onMounted(async () => {
  store.isPlayground = true

  if (route.query.content) {
    await store.loadSharedEncounter(route.query.content as string)
  }
  else {
    store.setPlaygroundValues()
  }

  startTour()
})
</script>

<template>
  <Layout
    name="wide"
    padding
  >
    <SkeletonEncounterTable v-if="store.isLoading" />
    <div v-else-if="store.encounter">
      <div class="container-max flex justify-end relative pb-4">
        <EncounterPet />
        <VisualOptions id="tour-13" />
      </div>
      <div id="tour-8">
        <div id="tour-0">
          <div class="space-y-4 relative rounded-lg bg-tracker/50 border-4 border-tracker">
            <EncounterHeader />
            <EncounterTable />
            <div class="inset-0 z-[-1] fancy-shadow" />
          </div>
          <EncounterOptions />
        </div>
      </div>
      <div
        v-if="!store.isLoading"
        class="pt-10 items-start grid md:grid-cols-2 gap-8"
      >
        <ClientOnly>
          <RichText
            v-if="(!store.encounter.settings.modified || store.encounter.settings.widgets?.includes('note'))"
            :content="store.encounter.info || ''"
            :label="$t('pages.encounter.info')"
            @update="store.encounterUpdate({ info: $event })"
          />
        </ClientOnly>
        <InfoDropdown
          v-if="(!store.encounter.settings.modified || store.encounter.settings.widgets?.includes('info-pins'))"
          :cards="store.encounter.info_cards"
        />
        <NameGenerator
          v-if="(!store.encounter.settings.modified || store.encounter.settings.widgets?.includes('fantasy-name-generator'))"
        />
      </div>
    </div>
  </Layout>
</template>
