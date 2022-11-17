<script setup>
defineProps({ encounter: { type: Object, required: true } })

const isAddingInit = ref(false)
const isRolling = ref(false)
</script>

<template>
  <div class="flex justify-end gap-2">
    <Button :label="$t('actions.roll')" class="tracker-shadow" @click="isRolling = true" />
    <Button
      :label="$t('encounter.addInInitiative')"
      color="primary"
      class="tracker-shadow"
      @click="isAddingInit = true"
    />
    <RollDiceModal :open="isRolling" @close="isRolling = false" />
    <AddInitiativeModal :open="isAddingInit" :encounter="encounter" @close="isAddingInit = false" />
  </div>
</template>
