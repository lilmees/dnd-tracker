<script setup lang="ts">
defineProps<{ row: Row, label?: string }>()

const isOpen = ref<boolean>(false)
</script>

<template>
  <div>
    <div
      v-if="label"
      class="flex flex-wrap items-center gap-x-2 cursor-pointer"
      @click="isOpen = true"
    >
      <Icon
        name="iconamoon:search-bold"
        class="w-4 h-4 text-primary cursor-pointer"
        aria-hidden="true"
      />
      <p>
        {{ label }}
      </p>
    </div>
    <Icon
      v-else
      name="charm:sword"
      class="w-6 h-6 text-primary cursor-pointer"
      aria-hidden="true"
      @click="isOpen = true"
    />
    <Modal v-if="isOpen" big @close="isOpen = false">
      <ActionsTable :row="row" />
    </Modal>
  </div>
</template>
