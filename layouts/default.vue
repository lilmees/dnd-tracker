<script setup lang="ts">
const showNav = useState<boolean>('showNavigation', () => true)

onBeforeMount(() => { showNav.value = true })
</script>

<template>
  <main class="pt-[150px] pb-20 dnd-container no-scrollbar overflow-y-auto grow">
    <slot />
  </main>
</template>
