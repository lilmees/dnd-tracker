<script setup lang="ts">
const showNav = useState<boolean>('showNavigation', () => true)

onBeforeMount(() => { showNav.value = true })
</script>

<template>
  <main class="mt-[150px] mb-20 dnd-container no-scrollbar overflow-y-auto grow">
    <slot />
  </main>
</template>
