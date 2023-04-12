<script setup>
import Check from '@/assets/icons/check.svg'
import Remove from '@/assets/icons/remove.svg'

defineEmits(['toggle'])
defineProps({ concentration: { type: Boolean, required: true } })
</script>

<template>
  <Check
    v-if="concentration"
    class="w-6 h-6 text-green-400 cursor-pointer mx-auto"
    @click="$emit('toggle')"
  />
  <Remove
    v-else
    class="w-6 h-6 text-red-400 cursor-pointer mx-auto"
    @click="$emit('toggle')"
  />
</template>
