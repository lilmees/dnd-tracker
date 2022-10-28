<script setup>
import Remove from '~/assets/icons/remove.svg'
</script>

<template>
  <div class="w-screen min-h-screen">
    <div class="container absolute w-full max-w-xl -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
      <div class="bg-tracker tracker-shadow-pulse px-2 py-6 sm:p-8 rounded relative">
        <NuxtLink to="/">
          <Remove class="w-5 h-5 text-danger cursor-pointer absolute right-4 top-4" />
        </NuxtLink>
        <slot />
      </div>
    </div>
  </div>
</template>
