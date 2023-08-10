<script setup lang="ts">
const emit = defineEmits(['update'])
const props = defineProps<{
  content: string,
  label: string
 }>()

const quill = ref <string>()

// Change string to html-string to be backwards compatible with old notes
quill.value = /<\/?[a-z][\s\S]*>/i.test(props.content)
  ? props.content
  : `<p>${props.content}</p>`

const update = useDebounceFn((html: string) => {
  emit('update', html)
}, 500, { maxWait: 500 })
</script>

<template>
  <div class="relative">
    <p v-if="label" class="font-bold body-small mb-1">
      {{ label }}
    </p>
    <QuillEditor
      :content="quill"
      content-type="html"
      theme="snow"
      toolbar="essentials"
      @update:content="update"
    />
  </div>
</template>
