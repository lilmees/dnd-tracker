<script setup>
defineProps({ encounter: { type: Object, required: true } })

const isAddingInit = ref(true)
</script>

<template>
  <div class="flex justify-end">
    <Button
      :label="$t('encounter.addInInitiative')"
      color="primary"
      class="tracker-shadow"
      @click="isAddingInit = true"
    />
    <AddInitiativeModal :open="isAddingInit" :encounter="encounter" @close="isAddingInit = false" />
  </div>
</template>
