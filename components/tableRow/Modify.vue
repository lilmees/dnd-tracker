<script setup lang="ts">
defineEmits(['copy', 'delete'])
</script>

<template>
  <div class="flex flex-wrap gap-2 justify-center">
    <button
      v-tippy="$t('actions.copy')"
      class="icon-btn-primary"
      :aria-label="$t('actions.copy')"
      @click="$emit('copy')"
    >
      <Icon
        name="material-symbols:content-copy-outline-rounded"
        class="w-6 h-6"
        aria-hidden="true"
      />
    </button>
    <button
      v-tippy="$t('actions.delete')"
      class="icon-btn-danger"
      :aria-label="$t('actions.delete')"
      @click="$emit('delete')"
    >
      <Icon
        name="material-symbols:delete-outline-rounded"
        class="w-6 h-6"
        aria-hidden="true"
      />
    </button>
  </div>
</template>
