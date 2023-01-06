<script setup>
import Add from '~/assets/icons/add.svg'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: { type: Array, required: true },
  id: { type: Number, required: true },
})

const isOpen = ref(false)

function addedMonster(monsters) {
  emitAndResetState(monsters)
}

function removedMonster(id) {
  emitAndResetState(props.modelValue.filter(p => p.id !== id))
}

function updatedMonster(monster) {
  const index = props.modelValue.findIndex(p => p.id === monster.id)
  const monsters = props.modelValue
  monsters[index] = monster
  emitAndResetState(monsters)
}

function emitAndResetState(state) {
  emit('update:modelValue', state)
  isOpen.value = false
}
</script>

<template>
  <section class="space-y-4">
    <div class="flex justify-between border-b border-slate-700 pb-1">
      <h2>{{ $t('monsters.homebrew') }}</h2>
      <Add
        v-tooltip="$t('actions.add')"
        @click="isOpen = true"
        class="w-4 h-4 cursor-pointer hover:scale-110 duration-200 ease-in-out text-success"
      />
    </div>
    <div v-if="!modelValue.length" class="space-y-2">
      <p class="text-center">{{ $t('monsters.none') }}</p>
      <Button :label="$t('monsters.add')" color="primary" class="mx-auto w-fit" @click="isOpen = true" />
    </div>
    <div v-else class="flex gap-2 flex-wrap items-start">
      <HomebrewMonsterCard
        v-for="monster in modelValue"
        :key="monster.created_at"
        :monster="monster"
        @deleted="removedMonster"
        @updated="updatedMonster"
      />
    </div>
    <AddCampaignMonster
      :open="isOpen"
      :id="id"
      :monsters="modelValue"
      @close="isOpen = false"
      @monsters="addedMonster"
    />
  </section>
</template>
