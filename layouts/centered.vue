<script setup>
import Remove from '~/assets/icons/remove.svg'

const localePath = useLocalePath()
</script>

<template>
  <div class="w-screen min-h-screen">
    <div class="container absolute w-full max-w-xl -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
      <div class="bg-tracker tracker-shadow-pulse px-2 py-6 sm:p-8 rounded relative">
        <NuxtLink :to="localePath('/')" class="group">
          <Remove
            class="w-5 h-5 text-danger cursor-pointer absolute right-4 top-4 rounded-full ring-danger group-focus-within:ring"
          />
        </NuxtLink>
        <slot />
      </div>
    </div>
  </div>
</template>
