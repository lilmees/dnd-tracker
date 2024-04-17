<script setup lang="ts">
const emit = defineEmits(['close'])
defineProps<{ open: boolean }>()

onKeyStroke('Escape', () => emit('close'))
</script>

<template>
  <Teleport to="body">
    <Opacity>
      <div
        v-if="open"
        class="fixed inset-0 bg-primary/40 backdrop-blur-xl z-20"
      />
    </Opacity>
    <SlideIn>
      <div
        v-if="open"
        class="fixed inset-0 z-30"
        aria-modal="true"
      >
        <div class="container container-max">
          <button
            class="absolute top-4 right-4 group"
            :aria-label="$t('actions.close')"
            @click="$emit('close')"
          >
            <Icon
              name="ic:round-clear"
              class="text-danger w-8 h-8 rounded-full ring-danger group-focus-within:ring"
              aria-hidden="true"
            />
          </button>
          <slot />
        </div>
      </div>
    </SlideIn>
  </Teleport>
</template>
