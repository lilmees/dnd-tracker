<script setup lang="ts">
defineEmits(['close'])
defineProps<{ open: boolean }>()
</script>

<template>
  <Modal v-if="open" @close="$emit('close')">
    <h2>{{ $t('actions.roll') }}</h2>
    <DiceRolling result />
  </Modal>
</template>
