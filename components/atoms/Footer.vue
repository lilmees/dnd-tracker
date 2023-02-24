<script setup>
const localePath = useLocalePath()
</script>

<template>
  <div class="bg-black rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 tracker-shadow m-2">
    <NuxtLink :to="localePath('/')">
      <h1 class="font-logo">DND-TRACKER</h1>
    </NuxtLink>
    <NuxtLink to="https://www.instagram.com/mount_lazarus/" target="_blank">
      <p class="body-small">Illustrations by Mount Lazarus</p>
    </NuxtLink>
    <p class="text-primary body-small">©{{ new Date().getFullYear() }} dnd-tracker</p>
  </div>
</template>
