<script setup>
const emit = defineEmits(['update'])
const props = defineProps({ 
  value: { type: [String, Number, null], default: null },
  placeholder: { type: String },
})

const text = ref(props.value)

watchDebounced(
  text, 
  () => emit('update', text.value), 
  { debounce: 500, maxWait: 1000 }
)
</script>

<template>
  <textarea
    v-model="text"
    :placeholder="placeholder"
    class="border-none outline-none text-white placeholder-slate-400 bg-transparent absolute inset-0 w-full px-2 resize-none"
  />
</template>