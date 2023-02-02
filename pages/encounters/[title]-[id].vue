<script setup>
import { useEncountersStore } from '@/store/encounters'
import { watchDebounced } from '@vueuse/core'
import { useToastStore } from '@/store/toast'
import { useI18n } from 'vue-i18n'

definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const toast = useToastStore()
const store = useEncountersStore()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { t } = useI18n({ useScope: 'global' })
const encounter = ref()
const info = ref('')
const isPending = ref(true)

// if the rows are json parse them
const rows = computed(() =>
  typeof encounter.value.rows === 'string' ? JSON.parse(encounter.value.rows) : encounter.value.rows
)

onMounted(() => {
  getEncounter()
  subscribeEncounterChanges()
})

watchDebounced(
  info,
  v => {
    if (v) {
      encounter.value.info = v
      saveUpdate()
    }
  },
  { debounce: 500, maxWait: 1000 }
)

async function getEncounter() {
  try {
    encounter.value = await store.getEncounterById(route.params.id)
    info.value = encounter.value.info
    if (!encounter.value.admins.includes(user.value.id)) navigateTo('/encounters')
    useHead({ title: encounter.value.title })
  } catch (err) {
    toast.error({
      title: t('error.general.title'),
      text: t('error.general.text'),
    })
  } finally {
    isPending.value = false
  }
}

async function subscribeEncounterChanges() {
  supabase
    .from('initiative-sheets')
    .on('*', payload => {
      if (payload.eventType === 'DELETE') {
        toast.info({
          title: t('encounter.toast.removed.title'),
          text: t('encounter.toast.removed.text'),
        })
        navigateTo('/encounters')
      } else {
        encounter.value = payload.new
        useHead({ title: payload.new.title })
      }
    })
    .subscribe()
}

function resetRounds() {
  encounter.value.round = 1
  encounter.value.activeIndex = 0
  saveUpdate()
}

function nextInitiative() {
  if (encounter.value.activeIndex + 1 < rows.value.length) encounter.value.activeIndex++
  else {
    encounter.value.activeIndex = 0
    encounter.value.round = encounter.value.round + 1
  }
  saveUpdate()
}

function updateRows(rows) {
  encounter.value.rows = rows
  saveUpdate()
}

async function saveUpdate() {
  const { profiles, created_at, created_by, ...enc } = encounter.value
  if (typeof enc.group === 'object') enc.group = enc.group.id
  await supabase.from('initiative-sheets').update(enc).eq('id', encounter.value.id)
}
</script>

<template>
  <NuxtLayout name="wide">
    <div v-if="isPending" class="loader" />
    <div v-else class="py-4 space-y-4">
      <Back url="encounters" :label="$t('encounter.back')" class="container-max" />
      <EncounterHeader :round="encounter.round" :title="encounter.title" @next="nextInitiative" @reset="resetRounds" />
      <EncounterTable :rows="rows" :activeIndex="encounter.activeIndex" @update="updateRows" />
      <EncounterOptions :encounter="encounter" />
      <Input type="textarea" name="info" v-model="info" :label="$t('encounter.info')" />
      <FabRoller />
    </div>
  </NuxtLayout>
</template>
