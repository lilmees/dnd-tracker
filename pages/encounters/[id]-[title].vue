<script setup>
import { useTableStore } from '@/store/table'
import { watchDebounced } from '@vueuse/core'
import { useToastStore } from '@/store/toast'
import { useI18n } from 'vue-i18n'

definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const toast = useToastStore()
const store = useTableStore()
const { t } = useI18n({ useScope: 'global' })

const info = ref('')

try{
  await store.getEncounter(route.params.id)
  useHead({ title: store.encounter.title })
  info.value = store.encounter.info
} catch (err) {
  toast.error({ title: t('error.general.title'), text: t('error.general.text') })
} 

watchDebounced(
  info,
  v => {
    if (v) store.encounterUpdate({info : v})
  },
  { debounce: 500, maxWait: 1000 }
)
</script>

<template>
  <NuxtLayout name="wide">
    <ClientOnly>
      <div v-if="store.isLoading" class="loader" />
      <div v-else class="py-4 space-y-4">
        <Back url="encounters" :label="$t('encounter.back')" class="container-max" />
        <EncounterHeader />
        <EncounterTable />
        <EncounterOptions class="pb-10"/>
        <Input 
          type="textarea" 
          name="info" 
          v-model="info" 
          :label="$t('encounter.info')" 
        />
        <FabRoller />
      </div>
    </ClientOnly>
  </NuxtLayout>
</template>
