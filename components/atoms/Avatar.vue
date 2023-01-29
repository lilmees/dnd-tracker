<script setup>
defineProps({
  image: { type: String, required: true },
  alt: { type: String, default: 'broken image' },
  name: { type: String },
  color: { type: String, default: '#ffffff' },
  owner: { type: Boolean, default: false },
})
</script>

<template>
  <div class="flex flex-col items-center">
    <NuxtImg :src="image" :alt="alt" sizes="sm:40px md:40px lg:40px" class="w-10 h-10" />
    <p
      v-if="name"
      :class="{
        'text-black': color === '#000000',
        '!text-primary': owner,
      }"
    >
      {{ name }}
    </p>
  </div>
</template>
