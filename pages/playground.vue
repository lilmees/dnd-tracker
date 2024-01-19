<script setup lang="ts">
const store = useTableStore()
const route = useRoute()

onMounted(async () => {
  if (route.query.content) {
    await store.loadSharedEncounter(route.query.content as string)
  } else {
    store.setPlaygroundValues()
  }
})
</script>

<template>
  <NuxtLayout name="wide" padding>
    <SkeletonEncounterTable v-if="store.isLoading" />
    <div v-else-if="store.encounter">
      <div class="container-max flex justify-end pb-4">
        <VisualOptions />
      </div>
      <div class="rounded-lg bg-tracker/50 border-4 border-tracker space-y-4 relative">
        <EncounterHeader />
        <EncounterTable />
        <EncounterOptions class="hidden md:flex" />
        <div class="abolsute inset-0 z-[-1] fancy-shadow" />
      </div>
      <EncounterOptions class="md:hidden" />
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
  </NuxtLayout>
</template>
