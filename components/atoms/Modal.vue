<script setup>
import Remove from '@/assets/icons/remove.svg'

defineEmits(['close'])
</script>

<template>
  <div class="fixed inset-0 bg-black/30 cursor-pointer z-10" @click="$emit('close')" />
  <div
    class="tracker-shadow-pulse fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-tracker rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto z-20"
  >
    <div class="relative">
      <Remove class="absolute -top-5 -right-5 text-danger cursor-pointer w-8 h-8" @click="$emit('close')" />
      <div class="space-y-8">
        <slot />
      </div>
    </div>
  </div>
</template>
