<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useToastStore } from '@/store/toast'
import { useEncountersStore } from '@/store/encounters'

definePageMeta({ middleware: ['auth'] })
useHead({ title: 'Encounters' })

const toast = useToastStore()
const store = useEncountersStore()

const isOpen: Ref<boolean> = ref(false)
const { error } = storeToRefs(store)

onMounted(() => store.fetch())

watch(error, (v) => {
  if (v) {
    toast.error()
  }
})
</script>

<template>
  <NuxtLayout>
    <div v-if="store.loading || !store.sortedEncounters" class="loader" />
    <div v-else-if="!store.error">
      <div class="pt-5 pb-10 flex justify-between items-center">
        <h1 class="grow">
          {{ $t('encounters.encounters') }}
        </h1>
        <button
          class="btn-primary tracker-shadow-pulse"
          :aria-label="$t('encounters.add')"
          @click="isOpen = true"
        >
          {{ $t('encounters.add') }}
        </button>
      </div>
      <div v-if="store.sortedEncounters">
        <div
          v-for="(group, index) in Object.values(store.sortedEncounters)"
          :key="index"
          class="space-y-4 pb-10"
        >
          <CampaignHeader
            v-if="Object.keys(store.sortedEncounters)[index] !== '0'"
            :campaign="
              typeof group[0].campaign === 'object'
                ? (group[0].campaign as Campaign).id
                : group[0].campaign
            "
          />
          <div class="flex flex-wrap gap-4 items-start">
            <EncounterCard
              v-for="encounter in group"
              :key="encounter.id"
              :encounter="encounter"
            />
          </div>
        </div>
      </div>
      <div
        v-else
        class="mx-auto max-w-lg tracker-shadow-pulse p-2 sm:p-10 rounded-lg space-y-4"
      >
        <h2>{{ $t('encounters.noData.title') }}</h2>
        <p>{{ $t('encounters.noData.text') }}</p>
        <button
          class="btn-primary"
          :aria-label="$t('encounters.add')"
          @click="isOpen = true"
        >
          {{ $t('encounters.add') }}
        </button>
      </div>
      <AddEncounterModal
        :open="isOpen"
        @close="isOpen = false"
        @added="isOpen = false"
      />
    </div>
    <div v-else class="max-w-sm mx-auto py-20 space-y-4">
      <h2 class="text-center text-danger">
        {{ $t('error.general.text') }}
      </h2>
      <button
        class="btn-black w-full"
        :aria-label="$t('actions.tryAgain')"
        @click="store.fetch()"
      >
        {{ $t('actions.tryAgain') }}
      </button>
    </div>
  </NuxtLayout>
</template>
