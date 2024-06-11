<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    items?: string[]
    sprite?: string
  }>(),
  {
    title: '',
    items: () => [],
    sprite: undefined,
  },
)
</script>

<template>
  <div class="group">
    <h2
      v-if="title"
      class="pb-4 relative max-w-max"
    >
      {{ title }}
      <img
        v-if="sprite"
        :src="`/art/${sprite}`"
        loading="lazy"
        class="w-10 h-10 absolute -right-12 -top-3 z-[-1] group-hover:rotate-12 transition-transform group-hover:scale-[1.2]"
      >
    </h2>
    <div
      v-if="items.length"
      class="flex flex-col gap-4"
    >
      <div
        v-for="item in items"
        :key="item"
        class="flex items-center gap-4"
      >
        <img
          src="/art/items/coin.svg"
          loading="lazy"
          class="w-6 h-6"
        >
        <p>{{ item }}</p>
      </div>
    </div>
  </div>
</template>
