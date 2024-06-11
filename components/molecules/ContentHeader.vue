<script setup lang="ts">
withDefaults(
  defineProps<{ shadow?: boolean }>(),
  { shadow: false },
)

const search = defineModel<string>('search')
</script>

<template>
  <div class="flex justify-between mb-8 items-center gap-8">
    <FormKit
      v-model="search"
      type="search"
      suffix-icon="search"
      :outer-class="`$reset !pb-0 w-fit ${shadow ? 'tracker-shadow' : ''}`"
    />
    <div class="flex gap-x-4 gap-y-2 items-center flex-wrap">
      <slot />
    </div>
  </div>
</template>
