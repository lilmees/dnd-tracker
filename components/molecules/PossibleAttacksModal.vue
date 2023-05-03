<script setup lang="ts">
defineProps<{ row: Row }>()

const isOpen: Ref<boolean> = ref(false)
</script>

<template>
  <div>
    <Icon
      name="charm:sword"
      class="w-6 h-6 cursor-pointer text-primary"
      @click="isOpen = true"
    />
    <Modal v-if="isOpen" big @close="isOpen = false">
      <ActionsTable :monster="row" />
    </Modal>
  </div>
</template>
