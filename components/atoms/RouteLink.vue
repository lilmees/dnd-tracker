<script setup lang="ts">
withDefaults(
  defineProps<{
    url: string,
    label?: string,
    style?: boolean
  }>(), {
    label: undefined,
    style: true
  }
)

const localePath = useLocalePath()
</script>

<template>
  <NuxtLink
    :to="localePath(url.charAt(0) === '/' ? url : `/${url}`)"
    class="duration-200 ease-in-out max-w-max font-bold"
    :class="{ 'text-slate-300 hover:text-white': style }"
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
