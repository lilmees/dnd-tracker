<script setup lang="ts">
withDefaults(
  defineProps<{
    padding?: boolean,
    shadow?: boolean }>(), {
    padding: false,
    shadow: false
  }
)

const showNav = useState<boolean>('showNavigation', () => true)

onBeforeMount(() => { showNav.value = true })
</script>

<template>
  <main
    class="max-w-[3000px] pb-20 mx-auto w-full px-4 no-scrollbar overflow-y-auto grow flex flex-col"
    :class="{ 'pt-[170px]': padding }"
  >
    <div class="relative">
      <div
        v-if="shadow"
        class="abolsute inset-0 z-[-1] fancy-shadow opacity-70"
      />
      <slot />
    </div>
  </main>
</template>
