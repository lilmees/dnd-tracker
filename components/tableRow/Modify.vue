<script setup lang="ts">
defineEmits(['copy', 'delete'])
</script>

<template>
  <div class="flex flex-wrap gap-1 justify-center">
    <Icon
      v-tippy="{ content: $t('actions.copy')}"
      name="material-symbols:content-copy-outline-rounded"
      class="w-6 h-6 cursor-pointer text-primary outline-none"
      aria-hidden="true"
      @click="$emit('copy')"
    />
    <Icon
      v-tippy="{ content: $t('actions.delete')}"
      name="material-symbols:delete-outline-rounded"
      class="w-6 h-6 cursor-pointer text-danger outline-none"
      aria-hidden="true"
      @click="$emit('delete')"
    />
  </div>
</template>
