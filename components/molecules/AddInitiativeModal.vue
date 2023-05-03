<script setup lang="ts">
const type: Ref<string> = ref('player')
const isOpen: Ref<boolean> = ref(false)

function closeModal (): void {
  type.value = 'player'
  isOpen.value = false
}
</script>

<template>
  <section>
    <button
      v-tippy="{ content: $t('encounter.addHomebrew'), animation: 'shift-away' }"
      class="flex gap-2 items-center disabled:opacity-40 disabled:cursor-not-allowed"
      @click="isOpen = true"
    >
      <span class="md:hidden">
        {{ $t('encounter.addHomebrew') }}
      </span>
      <Icon name="ph:beer-stein" class="text-warning w-10 h-10" />
    </button>
    <Modal v-if="isOpen" @close="closeModal">
      <h2>{{ $t('encounter.newHomebrew') }}</h2>
      <Select
        :absolute="false"
        :input-label="$t('inputs.typeLabel')"
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
