<script setup lang="ts">
withDefaults(
  defineProps<{ home?: boolean }>(),
  { home: false }
)

const store = useTableStore()
const online = useOnline()

const isOpen = ref<boolean>(false)
</script>

<template>
  <div
    class="p-4 flex justify-end"
    :class="{
      'md:justify-between md:items-center': !home
    }"
  >
    <div
      v-if="!home && !store.isPlayground"
      v-tippy="
        !online
          ? $t('general.offline')
          : $t(`general.${store.isSyncing ? 'syncing' : 'online'}`)
      "
      class="relative hidden md:block h-[34px]"
    >
      <Icon
        name="tabler:cloud"
        class="w-8 h-8 text-slate-300"
        aria-hidden="true"
      />
      <div
        class="w-3 h-3 absolute bottom-1 right-0 rounded-full animate-pulse"
        :class="{
          'bg-danger': !online,
          'bg-warning': store.isSyncing && online,
          'bg-success': !store.isSyncing && online,
        }"
      />
    </div>
    <div
      v-else-if="!home && store.isPlayground"
      class="hidden md:flex gap-2 max-w-[250px] items-center"
    >
      <Icon
        name="ph:warning-bold"
        class="min-w-[32px] min-h-[32px] text-warning "
        aria-hidden="true"
      />
      <span class="body-small text-slate-300">
        {{ $t('components.encounterOptions.playgroundWarning') }}
      </span>
    </div>
    <div class="flex flex-wrap flex-col md:flex-row items-end md:items-center justify-between gap-2">
      <HotkeysEncounter class="hidden md:block" />
      <InfoSearch />
      <EncounterDiceRoller />
      <AddInitiativeMonster />
      <template v-if="(store.encounter?.campaign || store.isSandbox) && !store.isPlayground">
        <AddInitiativeCampaignHomebrew />
      </template>
      <button
        v-tippy="$t('components.homebrewModal.add')"
        :aria-label="$t('components.homebrewModal.add')"
        class="flex gap-2 items-center"
        @click="isOpen = true"
      >
        <span class="md:hidden">
          {{ $t('components.homebrewModal.add') }}
        </span>
        <Icon
          name="ph:beer-stein"
          class="text-warning w-10 h-10"
          aria-hidden="true"
        />
      </button>
      <HomebrewModal
        encounter
        :open="isOpen"
        @close="isOpen = false"
      />
    </div>
  </div>
</template>
