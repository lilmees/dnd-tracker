<script setup>
import { useTableStore } from '@/store/table'

const store = useTableStore()
</script>

<template>
  <div class="flex flex-wrap justify-end gap-2">
    <AddInitiativeMonster />
    <template v-if="store.encounter.campaign || store.isSandbox">
      <AddInitiativeCampaignMonster />
      <AddInitiativeCampaignPlayer />
    </template>
    <AddInitiativeModal />
  </div>
</template>
