<script setup lang="ts">
withDefaults(
  defineProps<{ padding?: boolean }>(), {
    padding: false
  }
)

const showNav = useState<boolean>('showNavigation', () => true)

onBeforeMount(() => { showNav.value = true })
</script>

<template>
  <main
    class="max-w-[3000px] mb-20 mx-auto w-full px-4 no-scrollbar overflow-y-auto grow flex flex-col"
    :class="{ 'pt-[170px]': padding }"
  >
    <slot />
  </main>
</template>
