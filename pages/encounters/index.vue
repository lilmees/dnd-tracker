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
  if (!v) return
  toast.error({
    title: t('error.general.title'),
    text: t('error.general.text'),
  })
})
</script>

<template>
  <NuxtLayout>
    <div v-if="store.loading">loading</div>
    <div v-else-if="!store.error">
      <div class="py-5 flex justify-end">
        <div class="tracker-shadow-pulse">
          <Button :label="$t('encounters.add')" bold @click="isOpen = true" />
        </div>
      </div>
      <div v-for="(group, index) in Object.values(store.sortedEncounters)" :key="index" class="space-y-4 pb-10">
        <h2 v-if="Object.keys(store.sortedEncounters)[index] !== '0'" class="text-primary">
          {{ Object.keys(store.sortedEncounters)[index] }}
        </h2>
        <div class="flex flex-wrap gap-4">
          <EncounterCard v-for="encounter in group" :key="encounter.id" :encounter="encounter" />
        </div>
      </div>
      <AddEncounterModal :open="isOpen" @close="isOpen = false" @new="isOpen = false" />
    </div>
    <div v-else class="max-w-sm mx-auto py-20 space-y-4">
      <h2 class="text-center text-danger">{{ $t('error.general.text') }}</h2>
      <Button :label="$t('actions.tryAgain')" inline bold @click="store.fetch()" />
    </div>
  </NuxtLayout>
</template>
