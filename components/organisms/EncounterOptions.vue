<script setup lang="ts">
const store = useTableStore()

const isOpen = ref<boolean>(false)
</script>

<template>
  <div
    class="flex flex-wrap flex-col md:flex-row items-end md:items-center justify-end gap-2 p-4"
  >
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
    <HomebrewModal encounter :open="isOpen" @close="isOpen = false" />
  </div>
</template>
