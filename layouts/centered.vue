<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
  <div class="w-screen min-h-screen relative">
    <div
      class="absolute inset-0 bg-background cursor-pointer"
      @click="navigateTo(localePath('/'))"
    />
    <div
      class="container absolute w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
    >
      <div
        class="bg-tracker px-2 py-6 sm:p-8 rounded-lg relative border-4 border-primary tracker-shadow-pulse"
      >
        <NuxtLink :to="localePath('/')" class="group">
          <Icon
            name="ic:round-clear"
            class="w-8 h-8 text-danger cursor-pointer absolute right-4 top-4 rounded-full ring-danger group-focus-within:ring"
          />
        </NuxtLink>
        <div class="px-4 sm:px-8">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
