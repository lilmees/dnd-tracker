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
</script>

<template>
  <div>
    <div class="flex flex-wrap justify-center md:justify-start">
      <Tag
        v-for="condition in conditions"
        :key="condition.slug"
        removable
        :condition="condition"
        @remove="removeEffect($event)"
      />
    </div>
  </div>
</template>
