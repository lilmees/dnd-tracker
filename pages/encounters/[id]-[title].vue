<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const toast = useToastStore()
const store = useTableStore()
const { $logRocket } = useNuxtApp()

const info = ref<string>('')

if (route?.params?.id) {
  try {
    await store.getEncounter(route.params.id as string)
    if (store?.encounter?.title) {
      useHead({ title: store.encounter.title })
      info.value = store.encounter.info as string
    }
  } catch (err) {
    $logRocket.captureException(err as Error)
    toast.error()
  }
}

watchDebounced(
  info,
  (v: string) => {
    if (v) {
      store.encounterUpdate({ info: v })
    }
  },
  { debounce: 500, maxWait: 1000 }
)
</script>

<template>
  <NuxtLayout name="wide">
    <ClientOnly>
      <div v-if="store.isLoading" class="loader" />
      <div v-else-if="store.encounter" class="pt-20 pb-[100px]">
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
        <div class="rounded-lg p-4 bg-tracker space-y-4">
          <EncounterHeader class="w-full" />
          <EncounterTable />
          <EncounterOptions />
        </div>
        <div class="container pt-10 items-start grid md:grid-cols-2 gap-8">
          <Input
            v-model="info"
            type="textarea"
            name="info"
            :label="$t('pages.encounter.info')"
          />
          <InfoDropdown
            v-if="store.encounter?.info_cards?.length"
            :cards="store.encounter.info_cards"
          />
        </div>
      </div>
    </ClientOnly>
  </NuxtLayout>
</template>
