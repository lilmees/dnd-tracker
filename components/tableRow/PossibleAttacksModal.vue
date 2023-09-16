<script setup lang="ts">
defineEmits(['close'])

const table = useTableStore()
const campaign = useCurrentCampaignStore()
</script>

<template>
  <Modal big @close="$emit('close')">
    <ActionsTable
      v-if="table.activeRow || campaign.activeHomebrew"
      :row="table.activeRow || (campaign.activeHomebrew as Row)"
    />
  </Modal>
</template>
