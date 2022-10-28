<script setup>
import { sortByTeam } from '@/util/sortByTeam'
import { useToastStore } from '@/store/toast'
import { useI18n } from 'vue-i18n'

definePageMeta({ middleware: ['auth'] })
useHead({ title: 'Encounters' })

const toast = useToastStore()
const { t } = useI18n({ useScope: 'global' })
const supabase = useSupabaseClient()
const isPending = ref(true)
const isOpen = ref(false)
const encounters = ref([])
const sortedEncounters = ref()

onMounted(() => getEncounters())
useHead({ title: 'Encounters' })

async function getEncounters() {
  try {
    const { data, error } = await supabase.from('initiative_sheets').select('*, profiles(id, name, username, avatar)')
    if (error) throw error
    sortedEncounters.value = sortByTeam(data)
    encounters.value = data
  } catch (err) {
    toast.error({
      title: t('error.general.title'),
      text: t('error.general.text'),
    })
  } finally {
    isPending.value = false
  }
}

function newEncounter(encounter) {
  encounters.value.push(encounter)
  sortedEncounters.value = sortByTeam(encounters.value)
  isOpen.value = false
}
</script>

<template>
  <NuxtLayout>
    <div v-if="isPending">loading</div>
    <div v-else>
      <div class="py-5 flex justify-end">
        <div class="tracker-shadow-pulse">
          <Button :label="$t('encounters.add')" bold @click="isOpen = true" />
        </div>
      </div>
      <div v-for="(group, index) in Object.values(sortedEncounters)" :key="index" class="space-y-4 pb-10">
        <h2 v-if="Object.keys(sortedEncounters)[index] !== '0'" class="text-primary">
          {{ Object.keys(sortedEncounters)[index] }}
        </h2>
        <div class="flex flex-wrap gap-4">
          <EncounterCard v-for="encounter in group" :key="encounter.id" :encounter="encounter" />
        </div>
      </div>
      <AddEncounterModal :open="isOpen" @close="isOpen = false" @new="newEncounter" />
    </div>
  </NuxtLayout>
</template>
