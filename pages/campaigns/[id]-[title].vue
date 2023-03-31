<script setup>
import { useCampaignsStore } from '@/store/campaigns'
import { useEncountersStore } from '@/store/encounters'
import { useToastStore } from '@/store/toast'
import { useI18n } from 'vue-i18n'
import Add from '~/assets/icons/add.svg'

definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const localePath = useLocalePath()
const toast = useToastStore()
const store = useCampaignsStore()
const encountersStore = useEncountersStore()
const user = useSupabaseUser()
const { t } = useI18n({ useScope: 'global' })

const campaign = ref()
const encounters = ref([])
const isPending = ref(true)
const isCreatingEncounter = ref(false)

onMounted(() => getCampaignInfo())

async function getCampaignInfo() {
  try {
    campaign.value = await store.getCampaignById(route.params.id)
    if (!campaign.value.admins.includes(user.value.id)) navigateTo(localePath('/campaigns'))
    useHead({ title: campaign.value.title })
    encounters.value = await encountersStore.getEncountersByCampaign(campaign.value.id)
  } catch (err) {
    toast.error({ title: t('error.general.title'), text: t('error.general.text') })
    navigateTo('/campaigns')
  } finally {
    isPending.value = false
  }
}

function addedEncounter(encounter) {
  encounters.value.push(encounter)
  isCreatingEncounter.value = false
}

function deletedEncounter(id) {
  encounters.value = encounters.value.filter(e => e.id !== id)
  isCreatingEncounter.value = false
}

function updatedEncounter(encounter) {
  const index = encounters.value.findIndex(e => e.id === encounter.id)
  encounters.value[index] = encounter
}
</script>

<template>
  <NuxtLayout>
    <div v-if="isPending" class="loader" />
    <div v-else-if="campaign" class="py-4 space-y-4">
      <Back url="campaigns" :label="$t('campaign.back')" class="sm:hidden" />
      <div
        class="rounded w-full tracker-shadow relative p-2 flex"
        :style="{ 'background-color': campaign.background || '#000', color: campaign.color || '#fff' }"
      >
        <h1 class="grow text-center">
          {{ campaign.title }}
        </h1>
        <Back
          url="campaigns"
          :label="$t('campaign.back')"
          class="hidden sm:block absolute right-4 top-1/2 -translate-y-1/2"
          :color="campaign.color || '#fff'"
        />
      </div>
      <div class="space-y-8">
        <div class="space-y-4">
          <div class="flex justify-between border-b border-slate-700 pb-1">
            <h2>{{ $t('general.encounters') }}</h2>
            <Add
              v-tippy="{ content: $t('actions.add'), animation: 'shift-away' }"
              @click="isCreatingEncounter = true"
              class="w-4 h-4 cursor-pointer hover:scale-110 duration-200 ease-in-out text-success"
            />
          </div>
          <div v-if="encounters.length" class="flex flex-wrap gap-4 items-start">
            <EncounterCard
              v-for="encounter in encounters"
              :key="encounter.id"
              :encounter="encounter"
              @deleted="deletedEncounter"
              @copied="addedEncounter"
              @updated="updatedEncounter"
            />
          </div>
          <div v-else class="space-y-2">
            <p class="text-center">{{ $t('encounters.noData.title') }}</p>
            <Button
              :label="$t('encounters.add')"
              color="primary"
              bold
              class="mx-auto w-fit"
              @click="isCreatingEncounter = true"
            />
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8 py-8">
        <CampaignPlayers v-model="campaign.players" :id="campaign.id" />
        <CampaignMonsters v-model="campaign['homebrew-monsters']" :id="campaign.id" />
      </div>
      <CampaignNotes v-model="campaign.notes" :id="campaign.id" />
      <AddEncounterModal
        :open="isCreatingEncounter"
        :campaignId="campaign.id"
        @close="isCreatingEncounter = false"
        @added="addedEncounter"
      />
    </div>
  </NuxtLayout>
</template>
