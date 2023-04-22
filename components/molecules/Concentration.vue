<script setup>
defineEmits(['toggle'])
defineProps({ concentration: { type: Boolean, required: true } })
</script>

<template>
  <Icon
    v-if="concentration"
    name="material-symbols:check-small-rounded"
    class="w-8 h-8 text-success cursor-pointer mx-auto"
    @click="$emit('toggle')"
  />
  <Icon
    v-else
    name="ic:round-clear"
    class="w-8 h-8 text-danger cursor-pointer mx-auto"
    @click="$emit('toggle')"
  />
</template>
