<script setup lang="ts">
defineEmits(['toggled'])
withDefaults(
  defineProps<{
    selected: boolean
    border?: string
  }>(), {
    border: '#fff',
  },
)
</script>

<template>
  <div
    :style="{ 'border-color': border }"
    class="absolute inset-0 z-[1] rounded-lg border-4 bg-slate-300/50 cursor-pointer transition-colors duration-300 flex justify-center items-center text-black font-bold backdrop-blur-[2px] p-1 text-center"
    :class="{
      '!border-danger !bg-danger/50 !text-white': selected,
    }"
    @click="$emit('toggled')"
  >
    {{ $t(selected ? 'general.selectedToRemove' : 'actions.clickToSelect') }}
  </div>
</template>
