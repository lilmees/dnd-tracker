<script setup>
import Remove from '@/assets/icons/remove.svg'

defineEmits(['close'])
defineProps({ big: { type: Boolean, default: false } })
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-black/30 cursor-pointer z-10" @click="$emit('close')" />
    <div
      class="tracker-shadow-pulse fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-tracker rounded-xl p-8 w-full max-h-[90vh] overflow-y-auto z-20"
      :class="[big ? 'max-w-[1000px]' : 'max-w-2xl']"
    >
      <div class="relative">
        <button class="absolute -top-5 -right-5 group">
          <Remove
            class="text-danger w-8 h-8 rounded-full ring-danger group-focus-within:ring"
            @click="$emit('close')"
          />
        </button>
        <div class="space-y-8">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
