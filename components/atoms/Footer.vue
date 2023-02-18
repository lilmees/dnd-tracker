<script setup>
const localePath = useLocalePath()
</script>

<template>
  <div class="bg-black rounded-xl p-4 flex justify-between items-center gap-4 tracker-shadow m-2">
    <NuxtLink :to="localePath('/')">
      <h1 class="font-logo">DND-TRACKER</h1>
    </NuxtLink>
    <p class="text-primary body-small">©{{ new Date().getFullYear() }} dnd-tracker</p>
  </div>
</template>
