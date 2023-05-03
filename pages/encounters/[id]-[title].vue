<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { useTableStore } from '@/store/table'
import { useToastStore } from '@/store/toast'

definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const toast = useToastStore()
const store = useTableStore()

const info: Ref<string> = ref('')

if (route?.params?.id) {
  try {
    await store.getEncounter(route.params.id as string)
    if (store?.encounter?.title) {
      useHead({ title: store.encounter.title })
      info.value = store.encounter.info as string
    }
  } catch (err) {
    useBugsnag().notify(`Handeld in catch: ${err}`)
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
      <div v-else-if="store.encounter" class="py-4 space-y-4">
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
          :label="$t(store.encounter.campaign ? 'encounter.campaignBack' : 'encounter.back')"
          class="container-max"
        />
        <EncounterHeader />
        <EncounterTable />
        <EncounterOptions class="pb-10" />
        <Input
          v-model="info"
          type="textarea"
          name="info"
          :label="$t('encounter.info')"
        />
        <FabRoller />
      </div>
    </ClientOnly>
  </NuxtLayout>
</template>
