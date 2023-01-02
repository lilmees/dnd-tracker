<script setup>
const isOpen = ref(true)
const hits = ref([])

function addMonster(monster) {
  console.log(monster)
}
</script>

<template>
  <Modal v-if="isOpen" @close="isOpen = false" big>
    <AlgoliaInput index="monsters" placeholder="Copper dragon" label="Monster" @hits="v => (hits = v)">
      <div class="overflow-y-auto max-h-full space-y-2">
        <MonsterCard v-for="hit in hits" :key="hit.id" :monster="hit" addable @add="addMonster" />
      </div>
    </AlgoliaInput>
  </Modal>
</template>
