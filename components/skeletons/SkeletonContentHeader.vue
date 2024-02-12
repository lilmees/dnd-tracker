<script setup lang="ts">
withDefaults(
  defineProps<{
    hideToggle?: boolean
   }>(), {
    hideToggle: false
  }
)
</script>

<template>
  <div class="flex justify-between items-center gap-8">
    <SkeletonInput :label="false" class="w-[256px]" />
    <div v-if="!hideToggle" class="flex gap-x-4 gap-y-2 items-center flex-wrap">
      <div class="flex items-center gap-1">
        <div class="w-8 h-8 bg-tracker rounded-lg" />
        <span class="font-bold text-slate-300">
          |
        </span>
        <div class="w-8 h-8 bg-tracker rounded-lg" />
      </div>
    </div>
  </div>
</template>
