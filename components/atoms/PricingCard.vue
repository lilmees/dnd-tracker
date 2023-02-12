<script setup>
import Check from '~/assets/icons/check.svg'
import Remove from '@/assets/icons/remove.svg'

defineProps({
  items: { type: Array, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  current: { type: Boolean, default: false },
})
</script>

<template>
  <div
    class="flex flex-col p-6 text-center bg-tracker rounded-lg justify-between tracker-shadow cursor-pointer hover:scale-105 duration-200 ease-in-out"
    :class="{ 'ring-primary ring': current }"
  >
    <div class="flex flex-col">
      <h1 class="mb-4">{{ title }}</h1>
      <p class="">{{ description }}</p>
      <div class="flex justify-center items-baseline my-8">
        <span class="mr-2 text-5xl font-extrabold">{{ price }}€</span>
        <span>/{{ $t('pricing.month') }}</span>
      </div>
      <ul class="mb-8 space-y-4 text-left">
        <li v-for="item in items" :key="item" class="flex items-center space-x-3">
          <Check v-if="item.icon === 'check'" class="text-success" />
          <Remove v-else class="text-danger" />
          <span>{{ item.label }}</span>
        </li>
      </ul>
    </div>
    <Button :label="current ? $t('pricing.current') : $t('pricing.start')" inline color="primary" :disabled="current" />
  </div>
</template>
