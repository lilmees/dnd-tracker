<script setup>
defineProps({
  url: { type: String, required: true },
  label: { type: String, required: true }
})

const localePath = useLocalePath()
</script>

<template>
  <NuxtLink
    :to="localePath(`/${url}`)"
    class="text-slate-300 hover:text-white duration-200 ease-in-out max-w-max font-bold"
    active-class="active-link"
  >
    {{ label }}
  </NuxtLink>
</template>

<style scoped>
.active-link {
  @apply text-primary underline;
}
</style>
