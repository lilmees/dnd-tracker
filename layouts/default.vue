<script setup lang="ts">
const showNav = useState<boolean>('showNavigation', () => true)

withDefaults(
  defineProps<{
    shadow?: boolean
  }>(),
  {
    shadow: false,
  },
)

onBeforeMount(() => {
  showNav.value = true
})
</script>

<template>
  <main class="pt-[150px] pb-20 grow">
    <div class="relative">
      <div
        v-if="shadow"
        class="fixed !top-1/4 !left-0 !w-[50vw] !h-[50vh] fancy-shadow z-[-1] opacity-70"
      />
      <div class=" dnd-container no-scrollbar overflow-y-auto">
        <slot />
      </div>
    </div>
  </main>
</template>
