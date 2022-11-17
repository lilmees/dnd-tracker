<script setup>
import { useEncountersStore } from '@/store/encounters'

const emit = defineEmits(['close'])
const props = defineProps({
  open: { type: Boolean, required: true },
  encounter: { type: Object, required: true },
})

const store = useEncountersStore()
// const type = ref('player')
const type = ref('summon')

function closeModal() {
  type.value = 'player'
  emit('close')
}
</script>

<template>
  <Modal v-if="open" @close="closeModal">
    <h2>{{ $t('encounter.newInitiative') }}</h2>
    <Select
      :absolute="false"
      :inputLabel="$t('inputs.typeLabel')"
      :label="type"
      bold
      :options="store.initiativeTypes"
      @selected="v => (type = v)"
    />
    <AddPlayerInitiativeForm :type="type" :encounter="encounter" @close="closeModal" />
    <AddSummonInitiativeForm :type="type" :encounter="encounter" @close="closeModal" />
    <AddNpcInitiativeForm :type="type" :encounter="encounter" @close="closeModal" />
    <AddMonsterInitiativeForm :type="type" :encounter="encounter" @close="closeModal" />
    <AddLairInitiativeForm :type="type" :encounter="encounter" @close="closeModal" />
  </Modal>
</template>
