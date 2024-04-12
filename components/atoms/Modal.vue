<script setup lang="ts">
const emit = defineEmits(['close'])
withDefaults(
  defineProps<{
    open?: boolean
    big?: boolean
    title?: boolean
   }>(), {
    open: false,
    big: false,
    title: true
  }
)

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
        class="fixed inset-0 bg-black/30 cursor-pointer z-20"
        @click="$emit('close')"
      />
    </Transition>
    <Transition
      enter-active-class="duration-300 ease-in-out"
      enter-from-class="scale-0 opacity-0"
      enter-to-class="scale-100 opacity-100"
      leave-active-class="duration-300 ease-in-out"
      leave-from-class="scale-100 opacity-100"
      leave-to-class="scale-0 opacity-0"
    >
      <div
        v-if="open"
        class="border-4 border-slate-700 backdrop-blur-xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-700/50 rounded-lg p-8 w-full z-30"
        :class="[big ? 'max-w-[1000px]' : 'max-w-2xl']"
        aria-modal="true"
      >
        <div class="relative pb-4">
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
        <div class="inset-0 z-[-1] fancy-shadow" />
      </div>
    </Transition>
  </Teleport>
</template>
