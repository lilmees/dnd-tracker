<script setup lang="ts">
defineProps<{ content: string, icon: string }>()
</script>

<template>
  <div class="pt-8">
    <div
      class="flex flex-col md:flex-row gap-y-4 gap-x-10 bg-black/50 border-4 border-black rounded-lg p-6 max-w-prose mx-auto"
    >
      <Icon :name="icon" class="min-w-[50px] min-h-[50px] text-slate-300" />
      <div class="space-y-2">
        <p class="head-2">
          {{ $t('general.noContent.title', { content }) }}
        </p>
        <p class="text-slate-300">
          {{ $t('general.noContent.text', { content }) }}
        </p>
      </div>
    </div>
  </div>
</template>
