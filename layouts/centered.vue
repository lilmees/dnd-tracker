<script setup>
import Remove from '~/assets/icons/remove.svg'

const localePath = useLocalePath()
</script>

<template>
  <div class="w-screen min-h-screen background relative">
    <div class="absolute inset-0 bg-black/80 cursor-pointer" @click="navigateTo(localePath('/'))" />
    <div class="container absolute w-full max-w-xl -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
      <div class="bg-tracker px-2 py-6 sm:p-8 rounded-xl relative tracker-shadow">
        <NuxtLink :to="localePath('/')" class="group">
          <Remove
            class="w-5 h-5 text-danger cursor-pointer absolute right-4 top-4 rounded-full ring-danger group-focus-within:ring"
          />
        </NuxtLink>
        <div class="px-4 sm:px-8">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.background {
  background: linear-gradient(-45deg, #9eade6, #b09ce5, #cede9c, #35a4cc);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
