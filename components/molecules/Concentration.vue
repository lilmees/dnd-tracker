<script setup>
defineEmits(['toggle'])
defineProps({ concentration: { type: Boolean, required: true } })
</script>

<template>
  <div
    v-tippy="{
      content: $t('encounter.headers.concentration'),
      animation: 'shift-away'
    }"
    class="flex justify-center"
  >
    <Icon
      v-if="concentration"
      name="material-symbols:check-small-rounded"
      class="w-8 h-8 text-success cursor-pointer"
      @click="$emit('toggle')"
    />
    <Icon
      v-else
      name="ic:round-clear"
      class="w-8 h-8 text-danger cursor-pointer"
      @click="$emit('toggle')"
    />
  </div>
</template>
