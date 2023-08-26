<script setup lang="ts">
defineEmits(['close'])
defineProps<{ open: boolean }>()
</script>

<template>
  <Modal v-if="open" @close="$emit('close')">
    <template #header>
      <h2>{{ $t('actions.roll') }}</h2>
    </template>
    <DiceRolling result />
  </Modal>
</template>
