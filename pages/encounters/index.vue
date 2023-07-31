<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })
useHead({ title: 'Encounters' })

const toast = useToastStore()
const store = useEncountersStore()

const isOpen = ref<boolean>(false)
const { error } = storeToRefs(store)

onMounted(() => store.fetch())

whenever(error, () => { toast.error() })
</script>

<template>
  <NuxtLayout>
    <div v-if="!store.error">
      <div class="pt-5 pb-10 flex justify-between gap-4 items-center flex-wrap">
        <h1 class="grow">
          {{ $t('pages.encounters.encounters') }}
        </h1>
        <button
          class="btn-primary tracker-shadow-pulse"
          :aria-label="$t('pages.encounters.add')"
          @click="isOpen = true"
        >
          {{ $t('pages.encounters.add') }}
        </button>
      </div>
      <div
        v-if="store.loading"
        class="flex flex-wrap gap-4 items-start"
      >
        <SkeletonEncounterCard v-for="i in 10" :key="i" />
      </div>
      <div v-else-if="store.sortedEncounters">
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
        class="mx-auto max-w-lg border-4 border-primary p-2 sm:p-10 rounded-lg space-y-4"
      >
        <h2>{{ $t('pages.encounters.noData.title') }}</h2>
        <p>{{ $t('pages.encounters.noData.text') }}</p>
        <button
          class="btn-primary"
          :aria-label="$t('pages.encounters.add')"
          @click="isOpen = true"
        >
          {{ $t('pages.encounters.add') }}
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
        {{ $t('general.error.text') }}
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
