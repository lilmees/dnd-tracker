<script setup>
defineEmits(['close'])
defineProps({ open: { type: Boolean, required: true } })
</script>

<template>
  <Modal v-if="open" @close="$emit('close')">
    <h2>{{ $t('actions.roll') }}</h2>
    <DiceRolling result />
  </Modal>
</template>
