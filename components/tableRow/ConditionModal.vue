<script setup lang="ts">
const emit = defineEmits(['close'])
const props = withDefaults(
  defineProps<{
    conditions?: Condition[]
  }>(), {
    conditions: () => [],
  },
)

const table = useTableStore()
const store = useConditionsStore()

const selected = ref<Condition[]>(props.conditions || [])

onMounted(() => {
  if (table.activeRow) {
    selected.value = table.activeRow.conditions || []
  }
})

function updateConditions(): void {
  if (table.encounter && table.activeIndex !== undefined && table.activeRow) {
    table.activeRow.conditions = selected.value
    const rows = table.encounter.rows
    rows[table.activeIndex] = table.activeRow
    table.encounterUpdate({ rows })
  }

  emit('close')
}
</script>

<template>
  <Modal @close="$emit('close')">
    <template #header>
      <h2>
        {{ !store.error
          ? $t('pages.encounter.update.conditions')
          : $t('components.conditionModal.conditions.fetchErrorTitle')
        }}
      </h2>
    </template>
    <div
      v-if="!store.error"
      class="space-y-3"
    >
      <div class="flex flex-wrap gap-2">
        <template v-if="store.loading">
          <SkeletonTag
            v-for="i in 15"
            :key="i"
          />
        </template>
        <template v-else-if="store.data?.length">
          <Tag
            v-for="condition in store.data"
            :key="condition.id"
            :condition="condition"
            addable
            :selected="selected.map(s => s.slug).includes(condition.slug)"
            :removable="selected.map(s => s.slug).includes(condition.slug)"
            @add="selected = [...selected, $event]"
            @remove="selected = selected.filter(s => s.slug !== $event)"
          />
        </template>
      </div>
      <div class="flex justify-end">
        <button
          :disabled="!store.data?.length"
          class="btn-black"
          :aria-label="$t('actions.update')"
          @click="updateConditions"
        >
          {{ $t('actions.update') }}
        </button>
      </div>
    </div>
    <button
      v-else
      class="btn-black w-full"
      :aria-label="$t('actions.tryAgain')"
      @click="store.fetch()"
    >
      {{ $t('actions.tryAgain') }}
    </button>
  </Modal>
</template>
