<script setup lang="ts">
const emit = defineEmits(['update'])
const props = withDefaults(
  defineProps<{ conditions?: Condition[] }>(), {
    conditions: () => []
  }
)

function removeEffect (slug: string): void {
  emit('update', props.conditions.filter(s => s.slug !== slug))
}

function updateEffect (condition: Condition): void {
  const index = props.conditions.findIndex(s => s.slug === condition.slug)

  if (index > -1) {
    props.conditions[index] = condition
    emit('update', props.conditions)
  }
}
</script>

<template>
  <div>
    <div class="flex flex-wrap justify-center md:justify-start gap-1">
      <Tag
        v-for="condition in conditions"
        :key="condition.slug"
        removable
        :condition="condition"
        @update="updateEffect($event)"
        @remove="removeEffect($event)"
      />
    </div>
  </div>
</template>
