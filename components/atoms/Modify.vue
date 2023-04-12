<script setup>
import Copy from '@/assets/icons/copy.svg'
import Delete from '@/assets/icons/delete.svg'

defineEmits(['copy', 'delete'])
</script>

<template>
  <div class="flex flex-wrap gap-1 justify-center">
    <Copy
      v-tippy="{ content: $t('actions.copy'), animation: 'shift-away' }"
      class="w-6 h-6 cursor-pointer text-primary outline-none"
      @click="$emit('copy')"
    />
    <Delete
      v-tippy="{ content: $t('actions.delete'), animation: 'shift-away' }"
      class="w-6 h-6 cursor-pointer text-danger outline-none"
      @click="$emit('delete')"
    />
  </div>
</template>
