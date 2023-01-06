<script setup>
import Potion from '@/assets/icons/potion.svg'
import Remove from '@/assets/icons/remove.svg'
import { useConditionsStore } from '@/store/conditions'

const emit = defineEmits(['update'])
const props = defineProps({ conditions: { type: Array, required: true, default: [] } })

const store = useConditionsStore()
const isOpen = ref(false)
const info = ref()
const selected = ref(props.conditions || [])

onMounted(async () => {
  // if there are no conditions in the store fetch them
  if (!store.data && !store.loading) store.fetch()
})

// reset selected and info when modal is closed
watch(isOpen, v => {
  if (v) {
    selected.value = props.conditions || []
  } else {
    selected.value = []
    info.value = null
  }
})

function updateConditions() {
  emit('update', selected.value)
  isOpen.value = false
}
</script>

<template>
  <div>
    <Potion class="w-6 h-6 cursor-pointer text-success" @click="isOpen = true" />
    <Modal v-if="isOpen" @close="isOpen = false">
      <h2>{{ !store.error ? $t('encounter.update.conditions') : $t('encounter.conditions.fetchErrorTitle') }}</h2>
      <div v-if="store.loading" class="loader" />
      <div v-else-if="!store.error && store.data" class="space-y-3">
        <div class="flex flex-wrap gap-2">
          <Tag
            v-for="condition in store.data"
            :key="condition.id"
            :condition="condition"
            addable
            :selected="selected.map(s => s.id).includes(condition.id)"
            :removable="selected.map(s => s.id).includes(condition.id)"
            @add="selected = [...selected, $event]"
            @remove="selected = selected.filter(s => s.id !== $event)"
            @info="info = $event"
          />
        </div>
        <div v-if="info" class="border-primary border rounded p-4 relative">
          <Remove class="absolute top-1 right-1 text-danger cursor-pointer w-8 h-8" @click="info = null" />
          <p v-for="desc in info" :key="desc">{{ desc }}</p>
        </div>
        <Button :label="$t('actions.update')" inline @click="updateConditions" />
      </div>
      <div v-else>
        <Button :label="$t('actions.tryAgain')" inline @click="store.fetch()" />
      </div>
    </Modal>
  </div>
</template>
