<script setup>
import Copy from '@/assets/icons/copy.svg'
import Delete from '@/assets/icons/delete.svg'

defineEmits(['copy', 'delete'])
defineProps({ showcase: { type: Boolean, default: false } })
</script>

<template>
  <div v-if="!showcase" class="flex flex-wrap gap-1 justify-center">
    <Copy v-tippy="$t('actions.copy')" class="w-6 h-6 cursor-pointer text-primary" @click="$emit('copy')" />
    <Delete v-tippy="$t('actions.delete')" class="w-6 h-6 cursor-pointer text-danger" @click="$emit('delete')" />
  </div>
  <div v-else class="flex flex-wrap gap-1 justify-center">
    <Copy v-tippy="$t('actions.copy')" class="w-6 h-6 cursor-not-allowed text-gray-400" />
    <Delete v-tippy="$t('actions.delete')" class="w-6 h-6 cursor-not-allowed text-gray-400" />
  </div>
</template>
