<script setup lang="ts">
const emit = defineEmits(['update'])
const props = withDefaults(
  defineProps<{ conditions: Condition[] }>(), {
    conditions: () => []
  }
)

function removeEffect (slug: string, type: string): void {
  emit('update', {
    value: props.conditions.filter(s => s.slug !== slug),
    type
  })
}
</script>

<template>
  <div>
    <div class="flex flex-wrap gap-2 justify-center md:justify-start">
      <Tag
        v-for="condition in conditions"
        :key="condition.slug"
        removable
        :condition="condition"
        @remove="removeEffect($event, 'conditions')"
      />
    </div>
  </div>
</template>
