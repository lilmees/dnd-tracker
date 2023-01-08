<script setup>
import { useEncountersStore } from '@/store/encounters'

const props = defineProps({ encounter: { type: Object, required: true } })

const store = useEncountersStore()

const type = ref('player')
const isOpen = ref(false)

function closeModal() {
  type.value = 'player'
  isOpen.value = false
}
</script>

<template>
  <section>
    <Button :label="$t('encounter.addHomebrew')" color="primary" @click="isOpen = true" />
    <Modal v-if="isOpen" @close="closeModal">
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
  </section>
</template>
