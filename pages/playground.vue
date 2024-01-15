<script setup lang="ts">
import logRocket from 'logrocket'

const router = useRouter()
const route = useRoute()
const toast = useToastStore()
const store = useTableStore()

onMounted(() => {
  store.setPlaygroundValues()
  test()
})

function test (): void {
  // encode and compressing wasn't enough to make it small
  // option for encounter to be shared (create share token in db)
  // if there's a share token in db show it otherwise create empty playground encounter
  // Maybe there's a better way

  if (store.encounter) {
    // const query = lzwEncode(JSON.stringify(store.encounter))
    // console.log(query)
    console.log(JSON.stringify(store.encounter))
    // router.push({ query })
    // const enc = queryToEncounter(query)
    // console.log(enc)
  }
}
</script>

<template>
  <NuxtLayout name="wide" padding>
    <SkeletonEncounterTable v-if="store.isLoading" />
    <div v-else-if="store.encounter">
      <div class="container-max flex justify-end pb-4">
        <button class="btn-primary" @click="test">
          tester
        </button>
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
