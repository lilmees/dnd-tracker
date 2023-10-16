<script setup lang="ts">
const isShown = ref<boolean>(true)
</script>

<template>
  <Transition
    leave-active-class="duration-300 ease-in-out"
    leave-from-class="translate-0 opacity-100"
    leave-to-class="-translate-x-[125%] opacity-0"
  >
    <div
      v-if="isShown"
      class="mx-auto max-w-prose border-4 border-black bg-black/50 p-6 rounded-lg flex flex-col sm:flex-row sm:items-center gap-4 relative"
    >
      <button
        class="absolute top-1 right-1 group"
        :aria-label="$t('actions.close')"
        @click="isShown=false"
      >
        <Icon
          name="ic:round-clear"
          class="text-danger w-6 h-6 rounded-full ring-danger group-focus-within:ring"
          aria-hidden="true"
        />
      </button>
      <p class="body-small">
        {{ $t('components.limitCta.text') }}
      </p>
      <div class="flex justify-end">
        <RouteLink url="/pricing" class="btn-primary whitespace-nowrap">
          {{ $t('components.limitCta.cta') }}
        </RouteLink>
      </div>
    </div>
  </Transition>
</template>
