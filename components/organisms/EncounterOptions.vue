<script setup lang="ts">
const store = useTableStore()
</script>

<template>
  <div
    class="flex flex-wrap flex-col md:flex-row items-end md:items-center justify-end gap-2 p-4"
  >
    <Hotkeys class="hidden md:block" />
    <InfoSearch />
    <EncounterDiceRoller />
    <AddInitiativeMonster />
    <template v-if="store?.encounter?.campaign || store.isSandbox">
      <AddInitiativeCampaignHomebrew />
    </template>
    <HomebrewModal encounter />
  </div>
</template>
