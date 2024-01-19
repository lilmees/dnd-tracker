<script setup lang="ts">
const { data } = await useAsyncData('changelog', () => queryContent('/changelog').findOne())
</script>

<template>
  <Layout shadow>
    <ContentRenderer :value="data" />
  </Layout>
</template>
