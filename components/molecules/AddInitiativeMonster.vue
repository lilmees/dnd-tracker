<script setup>
import { createRowObject } from '@/util/createRowObject'
import { useTableStore } from '@/store/table'

const store = useTableStore()

const isOpen = ref(false)
const isLoading = ref(false)
const hits = ref([])

async function addMonster(monster) {
  try {
    isLoading.value = true
    const row = createRowObject(monster, 'monster', store.encounter.rows)
    await store.encounterUpdate({ 
      rows: store.encounter.rows.includes('[') ? [row] : [...store.encounter.rows, row]
    })
    isOpen.value = false
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <section>
    <Button :label="$t('encounter.addMonster')" color="danger" @click="isOpen = true" />
    <Modal v-if="isOpen" @close="isOpen = false" big>
      <FuzzyInput
        index="monsters"
        placeholder="Copper dragon"
        label="Monster"
        @hits="v => (hits = v)"
        :disabled="isLoading"
      >
        <div class="overflow-y-auto max-h-full space-y-2">
          <MonsterCard v-for="hit in hits" :key="hit.id" :monster="hit" addable @add="addMonster" />
        </div>
      </FuzzyInput>
    </Modal>
  </section>
</template>
