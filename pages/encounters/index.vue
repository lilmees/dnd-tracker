<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })
useHead({ title: 'Encounters' })
</script>

<template>
  <Layout shadow>
    <Encounters />
  </Layout>
</template>
