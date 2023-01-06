<script setup>
defineProps({ encounter: { type: Object, required: true } })

const isAddingHomebrew = ref(false)
const isAddingMonster = ref(false)
const isAddingCampaignMonster = ref(false)
const isAddingCampaignPlayer = ref(false)
</script>

<template>
  <div class="flex flex-wrap justify-end gap-2">
    <Button :label="$t('encounter.addMonster')" color="danger" @click="isAddingMonster = true" />
    <Button :label="$t('encounter.addCampaignMonster')" color="success" @click="isAddingCampaignMonster = true" />
    <Button :label="$t('encounter.addCampaignPlayer')" color="info" @click="isAddingCampaignPlayer = true" />
    <Button :label="$t('encounter.addHomebrew')" color="primary" @click="isAddingHomebrew = true" />
    <AddInitiativeModal :open="isAddingHomebrew" :encounter="encounter" @close="isAddingHomebrew = false" />
  </div>
</template>
