<script setup lang="ts">
import logRocket from 'logrocket'

definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const toast = useToastStore()
const store = useTableStore()

onMounted(async () => {
  if (route?.params?.id) {
    try {
      await store.getEncounter(route.params.id as string)
      if (store?.encounter?.title) {
        useHead({ title: store.encounter.title })
      }
    } catch (err) {
      logRocket.captureException(err as Error)
      toast.error()
    }
  }
})
</script>

<template>
  <NuxtLayout name="wide" padding>
    <SkeletonEncounterTable v-if="store.isLoading" />
    <div v-else-if="store.encounter">
      <div class="container-max flex justify-end pb-4">
        <Back
          :url="store.encounter.campaign
            ? `campaigns/${typeof store.encounter.campaign === 'object'
              ? store.encounter.campaign.id
              : store.encounter.campaign
            }-${
              typeof store.encounter.campaign === 'object'
                ? store.encounter.campaign.title.replace(/[\W]/g, '') === ''
                  ? 'campaign'
                  : store.encounter.campaign.title.replace(/[\W]/g, '')
                : 'campaign'
            }`
            : 'encounters'
          "
          :label="$t(store.encounter.campaign ? 'pages.encounter.campaignBack' : 'pages.encounter.back')"
        />
      </div>
      <div class="rounded-lg bg-tracker/50 border-4 border-tracker space-y-4">
        <EncounterHeader />
        <EncounterTable />
        <EncounterOptions />
      </div>
      <div
        v-if="!store.isLoading"
        class="container pt-10 items-start grid md:grid-cols-2 gap-8"
      >
        <ClientOnly>
          <RichText
            class="pt-2"
            :content="store.encounter.info || ''"
            :label="$t('pages.encounter.info')"
            @update="store.encounterUpdate({ info: $event })"
          />
        </ClientOnly>
        <InfoDropdown
          v-if="store.encounter?.info_cards?.length"
          :cards="store.encounter.info_cards"
        />
      </div>
    </div>
  </NuxtLayout>
</template>
