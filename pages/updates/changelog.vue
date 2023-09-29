<script setup lang="ts">
const { data } = await useAsyncData('changelog', () => queryContent('/changelog').findOne())
</script>

<template>
  <NuxtLayout>
    <ContentRenderer :value="data" />
  </NuxtLayout>
</template>
