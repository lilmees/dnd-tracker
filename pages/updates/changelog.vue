<script setup lang="ts">
const { data } = await useAsyncData('changelog', () => queryContent('/changelog').findOne())
</script>

<template>
  <NuxtLayout shadow>
    <ContentRenderer :value="data" />
  </NuxtLayout>
</template>
