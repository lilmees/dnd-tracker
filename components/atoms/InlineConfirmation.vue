<script setup lang="ts">
const confirmed = ref(false)
</script>

<template>
  <div class="overflow-hidden">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-full"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="opacity-0"
    >
      <div
        v-if="!confirmed"
        class="flex justify-end"
        @click="confirmed = true"
      >
        <slot name="trigger">
          <button
            class="btn-black"
            type="button"
            :aria-label="$t('actions.update')"
          >
            {{ $t('actions.update') }}
          </button>
        </slot>
      </div>
      <div
        v-else
        class="flex gap-2 bg-danger/50 p-4 rounded-lg border-4 border-danger"
      >
        <p class="body-small">
          {{ $t('components.inlineConfirmation.text') }}
        </p>
        <slot name="submit" />
      </div>
    </Transition>
  </div>
</template>
