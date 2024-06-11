<script setup lang="ts">
withDefaults(
  defineProps<{
    name?: 'centered' | 'wide'
    shadow?: boolean
    padding?: boolean
  }>(),
  {
    name: undefined,
    shadow: false,
    padding: false,
  },
)
</script>

<template>
  <div style="min-height: calc(100vh - 350px);">
    <NuxtLayout
      :name="name"
      :shadow="shadow"
      :padding="padding"
    >
      <slot />
    </NuxtLayout>
  </div>
</template>
