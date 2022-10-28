<script setup>
import Check from '@/assets/icons/check.svg'
import Remove from '@/assets/icons/remove.svg'

defineEmits(['toggle'])
defineProps({ concentration: { type: Boolean, required: true } })
</script>

<template>
  <Check v-if="concentration" @click="$emit('toggle')" class="w-6 h-6 text-green-400 cursor-pointer" />
  <Remove v-else @click="$emit('toggle')" class="w-6 h-6 text-red-400 cursor-pointer" />
</template>
