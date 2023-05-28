<script setup lang="ts">
import { useConditionsStore } from '@/store/conditions'

const emit = defineEmits(['update'])
const props = withDefaults(
  defineProps<{ conditions?: Condition[] }>(), {
    conditions: () => []
  }
)

const store = useConditionsStore()

const isOpen: Ref<boolean> = ref(false)
const selected: Ref<Condition[]> = ref(props.conditions || [])

// reset selected and info when modal is closed
watch(isOpen, (v: boolean) => {
  if (v) {
    selected.value = props.conditions || []
  } else {
    selected.value = []
  }
})

function updateConditions (): void {
  emit('update', selected.value)
  isOpen.value = false
}
</script>

<template>
  <div>
    <Icon
      name="iconoir:round-flask"
      class="w-6 h-6 cursor-pointer text-success"
      @click="isOpen = true"
    />
    <Modal v-if="isOpen" @close="isOpen = false">
      <h2>
        {{ !store.error
          ? $t('encounter.update.conditions')
          : $t('encounter.conditions.fetchErrorTitle')
        }}
      </h2>
      <div v-if="store.loading" class="loader" />
      <div
        v-else-if="!store.error && store.data?.length"
        class="space-y-3"
      >
        <div class="flex flex-wrap gap-2">
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
        </div>
        <button
          class="btn-black w-full"
          :aria-label="$t('actions.update')"
          @click="updateConditions"
        >
          {{ $t('actions.update') }}
        </button>
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
  </div>
</template>
