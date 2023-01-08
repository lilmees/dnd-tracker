<script setup>
defineProps({ encounter: { type: Object, required: true } })

const isAddingMonster = ref(false)
const isAddingCampaignMonster = ref(false)
const isAddingCampaignPlayer = ref(false)
</script>

<template>
  <div class="flex flex-wrap justify-end gap-2">
    <Button :label="$t('encounter.addMonster')" color="danger" @click="isAddingMonster = true" />
    <Button :label="$t('encounter.addCampaignMonster')" color="success" @click="isAddingCampaignMonster = true" />
    <Button :label="$t('encounter.addCampaignPlayer')" color="info" @click="isAddingCampaignPlayer = true" />
    <AddInitiativeModal :encounter="encounter" />
  </div>
</template>
