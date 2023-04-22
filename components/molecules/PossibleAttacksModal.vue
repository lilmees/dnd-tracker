<script setup>
defineProps({ actions: { type: Array, required: true } })

const isOpen = ref(false)
</script>

<template>
  <div>
    <Icon
      name="charm:sword"
      class="w-6 h-6 cursor-pointer text-primary"
      @click="isOpen = true"
    />
    <Modal v-if="isOpen" big @close="isOpen = false">
      <ActionsTable big :actions="actions" />
    </Modal>
  </div>
</template>
