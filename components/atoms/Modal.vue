<script setup lang="ts">
const emit = defineEmits(['close'])
withDefaults(
  defineProps<{
    big?: boolean
    title?: boolean
   }>(), {
    big: false,
    title: true
  }
)

onKeyStroke('Escape', () => emit('close'))
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-black/30 cursor-pointer z-10" @click="$emit('close')" />
    <div
      class="tracker-shadow-pulse border-4 border-black backdrop-blur-xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/20 rounded-lg p-8 w-full z-20"
      :class="[big ? 'max-w-[1000px]' : 'max-w-2xl']"
      aria-modal="true"
    >
      <div class="relative">
        <button
          class="absolute -top-7 -right-7 group"
          :aria-label="$t('actions.close')"
          @click="$emit('close')"
        >
          <Icon
            name="ic:round-clear"
            class="text-danger w-8 h-8 rounded-full ring-danger group-focus-within:ring"
            aria-hidden="true"
          />
        </button>
        <slot name="header" />
      </div>
      <div
        class="mx-h-full overflow-auto max-h-[75vh]"
        :class="{ 'mt-6': title }"
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>
