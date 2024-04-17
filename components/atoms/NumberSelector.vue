<script setup lang="ts">
const { min, max } = defineProps<{ max: number, min: number }>()

const amount = defineModel<number>({ required: true })

function increment () {
  if (amount.value < max) { amount.value++ }
}

function decrement () {
  if (amount.value > min) { amount.value-- }
}
</script>

<template>
  <div class="flex gap-1 border border-slate-700 rounded items-center">
    <button
      :disabled="amount <= min"
      class="disabled:opacity-40 disabled:cursor-not-allowed"
      @click="decrement"
    >
      <Icon
        name="tabler:chevron-left"
        class="h-4 w-4"
        aria-hidden="true"
      />
    </button>
    <span class="border-x border-slate-700 px-2 text-xs min-w-7 text-center">
      {{ amount }}
    </span>
    <button
      :disabled="amount >= max"
      class="disabled:opacity-40 disabled:cursor-not-allowed"
      @click="increment"
    >
      <Icon
        name="tabler:chevron-right"
        class="h-4 w-4"
        aria-hidden="true"
      />
    </button>
  </div>
</template>
