<script setup lang="ts">
defineEmits(['toggle'])
defineProps<{ concentration: boolean }>()
</script>

<template>
  <div
    v-tippy="$t('general.concentration')"
    class="flex justify-center"
  >
    <button
      :aria-label="$t('general.concentration')"
      @click="$emit('toggle')"
    >
      <Icon
        v-if="concentration"
        name="material-symbols:check-small-rounded"
        class="w-8 h-8 text-success"
        aria-hidden="true"
      />
      <Icon
        v-else
        name="ic:round-clear"
        class="w-8 h-8 text-danger"
        aria-hidden="true"
      />
    </button>
  </div>
</template>
