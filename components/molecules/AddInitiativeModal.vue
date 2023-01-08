<script setup>
import { useEncountersStore } from '@/store/encounters'

const props = defineProps({
  encounter: { type: Object, required: true },
  sandbox: { type: Boolean, default: false },
})

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
    <Button :label="$t('encounter.addHomebrew')" color="primary" @click="isOpen = true" :disabled="sandbox" />
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
      <AddPlayerInitiativeForm :type="type" :encounter="encounter" :sandbox="sandbox" @close="closeModal" />
      <AddSummonInitiativeForm :type="type" :encounter="encounter" :sandbox="sandbox" @close="closeModal" />
      <AddNpcInitiativeForm :type="type" :encounter="encounter" :sandbox="sandbox" @close="closeModal" />
      <AddMonsterInitiativeForm :type="type" :encounter="encounter" :sandbox="sandbox" @close="closeModal" />
      <AddLairInitiativeForm :type="type" :encounter="encounter" :sandbox="sandbox" @close="closeModal" />
    </Modal>
  </section>
</template>
