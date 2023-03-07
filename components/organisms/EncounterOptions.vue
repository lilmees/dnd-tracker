<script setup>
defineProps({
  encounter: { type: Object, required: true },
  sandbox: { type: Boolean, default: false },
})
</script>

<template>
  <div class="flex flex-wrap justify-end gap-2">
    <AddInitiativeMonster :encounter="encounter" :sandbox="sandbox" />
    <template v-if="encounter.campaign">
      <AddInitiativeCampaignMonster :encounter="encounter" :sandbox="sandbox" />
      <AddInitiativeCampaignPlayer :encounter="encounter" :sandbox="sandbox" />
    </template>
    <AddInitiativeModal :encounter="encounter" :sandbox="sandbox" />
  </div>
</template>
