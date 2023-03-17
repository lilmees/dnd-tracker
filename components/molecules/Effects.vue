<script setup>
const emit = defineEmits(['update'])
const props = defineProps({ conditions: { type: Array, default: [] }})

const info = ref()

function removeEffect(id, type) {
  emit('update', { value: props.conditions.filter(s => s.id !== id), type })
}
</script>

<template>
  <div>
    <div class="flex flex-wrap gap-2 justify-center md:justify-start">
      <Tag
        removable
        v-for="condition in conditions"
        :key="condition"
        :condition="condition"
        @remove="removeEffect($event, 'conditions')"
        @info="info = $event"
      />
    </div>
    <Modal v-if="info" @close="info = null">
      <h2>{{ $t('encounter.conditionInfo') }}</h2>
      <div>
        <p v-for="desc in info" :key="desc">{{ desc }}</p>
      </div>
    </Modal>
  </div>
</template>
