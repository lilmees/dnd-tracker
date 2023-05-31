<script setup lang="ts">
import { useTableStore } from '@/store/table'

const store = useTableStore()
</script>

<template>
  <div
    class="flex flex-wrap flex-col md:flex-row items-end md:items-center justify-end gap-2"
  >
    <FabRoller />
    <AddInitiativeMonster />
    <template v-if="store?.encounter?.campaign || store.isSandbox">
      <AddInitiativeCampaignHomebrew />
    </template>
    <AddInitiativeModal />
  </div>
</template>
