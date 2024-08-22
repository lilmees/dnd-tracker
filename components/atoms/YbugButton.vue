<script setup lang="ts">
const ybug: any = inject('ybug')
</script>

<template>
  <button
    v-if="ybug && $route.path !== '/' && $route.path !== '/en'"
    class="btn-primary backdrop-blur-sm py-1 px-2 fixed -right-[60px] top-1/2 -translate-y-1/2 -rotate-90 z-[1]"
    @click="ybug.open()"
  >
    Bug Buster 🔫
  </button>
</template>
