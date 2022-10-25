<script setup>
const user = useSupabaseUser()
</script>

<template>
  <NuxtLayout name="wide">
    <p>home</p>
    <p>logged in: {{ !!user }}</p>
  </NuxtLayout>
</template>
