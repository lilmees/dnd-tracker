<script setup>
import Add from '~/assets/icons/add.svg'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: { type: Array, required: true },
  id: { type: Number, required: true },
})

const isOpen = ref(false)

function addedPlayer(players) {
  emitAndResetState(players)
}

function removedPlayer(id) {
  emitAndResetState(props.modelValue.filter(p => p.id !== id))
}

function updatedPlayer(player) {
  const index = props.modelValue.findIndex(p => p.id === player.id)
  const players = props.modelValue
  players[index] = player
  emitAndResetState(players)
}

function emitAndResetState(state) {
  emit('update:modelValue', state)
  isOpen.value = false
}
</script>

<template>
  <section class="space-y-4">
    <div class="flex justify-between border-b border-slate-700 pb-1">
      <h2>{{ $t('general.players') }}</h2>
      <Add
        v-tooltip="$t('actions.add')"
        @click="isOpen = true"
        class="w-4 h-4 cursor-pointer hover:scale-110 duration-200 ease-in-out text-success"
      />
    </div>
    <div v-if="!modelValue.length" class="space-y-2">
      <p class="text-center">{{ $t('players.none') }}</p>
      <Button :label="$t('players.add')" color="primary" class="mx-auto w-fit" @click="isOpen = true" />
    </div>
    <div v-else class="flex gap-2 flex-wrap items-start">
      <PlayerCard
        v-for="player in modelValue"
        :key="player.created_at"
        :player="player"
        @deleted="removedPlayer"
        @updated="updatedPlayer"
      />
    </div>
    <AddCampaignPlayer :open="isOpen" :id="id" :players="modelValue" @close="isOpen = false" @players="addedPlayer" />
  </section>
</template>
