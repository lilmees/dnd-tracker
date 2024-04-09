<script setup lang="ts">
const table = useTableStore()
</script>

<template>
  <img
    v-if="table.encounter?.settings?.pet"
    :src="`/gifs/${table.encounter.settings.pet}.gif`"
    loading="lazy"
    class="w-8 h-8 absolute bottom-0 left-10"
  >
</template>
