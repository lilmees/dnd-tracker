<script setup>
import Reset from '@/assets/icons/reset.svg'

defineEmits(['next', 'reset'])
defineProps({
  round: { type: Number, required: true },
  title: { type: String, required: true },
})
</script>

<template>
  <div class="flex flex-wrap gap-4 items-center justify-between container-max">
    <div class="flex gap-2 font-bold">
      <p>{{ $t('encounter.round') }}: {{ round }}</p>
      <Reset class="w-5 h-5 text-danger cursor-pointer" @click="$emit('reset')" />
    </div>
    <h1>{{ title }}</h1>
    <div class="tracker-shadow-pulse">
      <Button :label="$t('encounter.next')" @click="$emit('next')" />
    </div>
  </div>
</template>
