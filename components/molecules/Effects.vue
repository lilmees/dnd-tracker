<script setup>
const emit = defineEmits(['update'])
const props = defineProps({
  conditions: { type: Array, default: [] },
  curses: { type: Array, default: [] },
})

const info = ref()

function removeEffect(id, effectType) {
  emit('update', { value: props[effectType].filter(s => s.id !== id), type: effectType })
}
</script>

<template>
  <div>
    <div class="flex flex-col gap-2 items-center">
      <Tag
        removable
        v-for="condition in conditions"
        :key="condition"
        :condition="condition"
        @remove="removeEffect($event, 'conditions')"
        @info="info = $event"
      />
      <Tag
        removable
        v-for="curse in curses"
        :key="curse"
        :condition="curse"
        @remove="removeEffect($event, 'curses')"
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
