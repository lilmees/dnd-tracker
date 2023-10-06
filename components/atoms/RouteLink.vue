<script setup lang="ts">
defineProps<{ url: string, label?: string}>()

const localePath = useLocalePath()
</script>

<template>
  <NuxtLink
    :to="localePath(url.charAt(0) === '/' ? url : `/${url}`)"
    class="text-slate-300 hover:text-white duration-200 ease-in-out max-w-max font-bold"
    active-class="active-link"
  >
    <slot>
      <span v-if="label">
        {{ label }}
      </span>
    </slot>
  </NuxtLink>
</template>

<style scoped>
.active-link {
  @apply underline underline-offset-4;
}
</style>
