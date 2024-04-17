<script setup lang="ts">
import logRocket from 'logrocket'

definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const toast = useToastStore()
const store = useTableStore()

const { startTour } = useTour()

onMounted(async () => {
  if (route?.params?.id) {
    try {
      await store.getEncounter(route.params.id as string)

      if (store?.encounter?.title) {
        useHead({ title: store.encounter.title })
      }

      startTour(!!store.encounter?.campaign)
    } catch (err) {
      logRocket.captureException(err as Error)
      toast.error()
    }
  }
})

onBeforeUnmount(async () => await store.unsubscribeEncounterChanges())
</script>

<template>
  <Layout name="wide" padding>
    <SkeletonEncounterTable v-if="store.isLoading" />
    <div v-else-if="store.encounter">
      <div class="container-max flex justify-end pb-4 relative">
        <div class="flex gap-y-2 gap-x-6 items-center flex-wrap">
          <Back
            :url="backUrl(store.encounter.campaign)"
            :label="$t(store.encounter.campaign ? 'pages.encounter.campaignBack' : 'pages.encounter.back')"
          />
          <VisualOptions id="tour-13" />
        </div>
        <EncounterPet />
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
