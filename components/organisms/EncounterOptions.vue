<script setup>
defineProps({ encounter: { type: Object, required: true } })

const isAddingMonster = ref(false)
const isAddingCampaignMonster = ref(false)
</script>

<template>
  <div class="flex flex-wrap justify-end gap-2">
    <Button :label="$t('encounter.addMonster')" color="danger" @click="isAddingMonster = true" />
    <Button :label="$t('encounter.addCampaignMonster')" color="success" @click="isAddingCampaignMonster = true" />
    <AddInitiativeCampaignPlayer :encounter="encounter" />
    <AddInitiativeModal :encounter="encounter" />
  </div>
</template>
