<script setup>
import { useToastStore } from '@/store/toast'
import { useEncountersStore } from '@/store/encounters'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'

definePageMeta({ middleware: ['auth'] })
useHead({ title: 'Encounters' })

const toast = useToastStore()
const store = useEncountersStore()
const { t } = useI18n({ useScope: 'global' })
const isOpen = ref(false)
const { error } = storeToRefs(store)

onMounted(() => store.fetch())

watch(error, v => {
  if (v) toast.error({ title: t('error.general.title'), text: t('error.general.text') })
})
</script>

<template>
  <NuxtLayout>
    <div v-if="store.loading || !store.sortedEncounters" class="loader" />
    <div v-else-if="!store.error">
      <div class="py-5 flex justify-between items-center">
        <h1>{{ $t('encounters.encounters') }}</h1>
        <Button :label="$t('encounters.add')" @click="isOpen = true" />
      </div>
      <div v-if="store.sortedEncounters">
        <div v-for="(group, index) in Object.values(store.sortedEncounters)" :key="index" class="space-y-4 pb-10">
          <CampaignHeader v-if="Object.keys(store.sortedEncounters)[index] !== '0'" :campaign="group[0].campaign" />
          <div class="flex flex-wrap gap-4">
            <EncounterCard v-for="encounter in group" :key="encounter.id" :encounter="encounter" />
          </div>
        </div>
      </div>
      <div v-else class="mx-auto max-w-lg tracker-shadow-pulse p-2 sm:p-10 rounded-xl space-y-4">
        <h2>{{ $t('encounters.noData.title') }}</h2>
        <p>{{ $t('encounters.noData.text') }}</p>
        <Button :label="$t('encounters.add')" @click="isOpen = true" />
      </div>
      <AddEncounterModal :open="isOpen" @close="isOpen = false" @added="isOpen = false" />
    </div>
    <div v-else class="max-w-sm mx-auto py-20 space-y-4">
      <h2 class="text-center text-danger">{{ $t('error.general.text') }}</h2>
      <Button :label="$t('actions.tryAgain')" inline @click="store.fetch()" />
    </div>
  </NuxtLayout>
</template>
