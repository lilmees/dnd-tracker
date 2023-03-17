<script setup>
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
        :options="[
          { label: 'Player', id: 'player' },
          { label: 'Summon', id: 'summon' },
          { label: 'Npc', id: 'npc' },
          { label: 'Monster', id: 'monster' },
          { label: 'Lair', id: 'lair' },
        ]"
        @selected="v => (type = v)"
      />
      <AddPlayerInitiativeForm :type="type" @close="closeModal" />
      <AddSummonInitiativeForm :type="type" @close="closeModal" />
      <AddNpcInitiativeForm :type="type" @close="closeModal" />
      <AddMonsterInitiativeForm :type="type" @close="closeModal" />
      <AddLairInitiativeForm :type="type" @close="closeModal" />
    </Modal>
  </section>
</template>
