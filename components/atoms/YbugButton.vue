<script setup lang="ts">
const ybug: any = inject('ybug')
</script>

<template>
  <button
    v-if="ybug"
    class="btn-primary py-1 px-2 fixed -right-[50px] top-1/2 -translate-y-1/2 -rotate-90"
    @click="ybug.open()"
  >
    Bug Buster 🔫
  </button>
</template>
