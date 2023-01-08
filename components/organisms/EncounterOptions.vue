<script setup>
defineProps({ encounter: { type: Object, required: true } })
</script>

<template>
  <div class="flex flex-wrap justify-end gap-2">
    <AddInitiativeMonster :encounter="encounter" />
    <AddInitiativeCampaignMonster :encounter="encounter" />
    <AddInitiativeCampaignPlayer :encounter="encounter" />
    <AddInitiativeModal :encounter="encounter" />
  </div>
</template>
