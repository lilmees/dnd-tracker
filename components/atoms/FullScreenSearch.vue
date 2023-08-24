<script setup lang="ts">
const emit = defineEmits(['close'])

onKeyStroke('Escape', () => emit('close'))
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-black/30 z-10 backdrop-blur">
      <div class="container">
        <button class="absolute top-4 right-4 group">
          <Icon
            name="ic:round-clear"
            class="text-danger w-8 h-8 rounded-full ring-danger group-focus-within:ring"
            @click="$emit('close')"
          />
        </button>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
