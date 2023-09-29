<script setup lang="ts">
const emit = defineEmits(['close'])
defineProps<{ open: boolean }>()

onKeyStroke('Escape', () => emit('close'))
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="duration-300 ease-in-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-300 ease-in-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 bg-primary/40 backdrop-blur-xl z-20"
      />
    </Transition>
    <Transition
      enter-active-class="duration-300 ease-in-out"
      enter-from-class="-translate-y-full opacity-0"
      enter-to-class="translate-0 opacity-100"
      leave-active-class="duration-300 ease-in-out"
      leave-from-class="translate-0 opacity-100"
      leave-to-class="-translate-y-full opacity-0"
    >
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
    </Transition>
  </Teleport>
</template>
