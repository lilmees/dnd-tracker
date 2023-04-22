<script setup>
defineEmits(['copy', 'delete'])
</script>

<template>
  <div class="flex flex-wrap gap-1 justify-center">
    <Icon
      v-tippy="{ content: $t('actions.copy'), animation: 'shift-away' }"
      name="material-symbols:content-copy-outline-rounded"
      class="w-6 h-6 cursor-pointer text-primary outline-none"
      @click="$emit('copy')"
    />
    <Icon
      v-tippy="{ content: $t('actions.delete'), animation: 'shift-away' }"
      name="material-symbols:delete-outline-rounded"
      class="w-6 h-6 cursor-pointer text-danger outline-none"
      @click="$emit('delete')"
    />
  </div>
</template>
