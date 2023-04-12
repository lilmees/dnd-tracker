<script setup>
import Book from '@/assets/icons/book.svg'
import { createRowObject } from '@/util/createRowObject'
import { useTableStore } from '@/store/table'

const store = useTableStore()

const isOpen = ref(false)
const isLoading = ref(false)
const hits = ref([])

async function addMonster (monster) {
  try {
    isLoading.value = true
    const row = createRowObject(monster, 'monster', store.encounter.rows)
    await store.encounterUpdate({
      rows: store.encounter.rows.includes('[')
        ? [row]
        : [...store.encounter.rows, row]
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
    <button
      v-tippy="{ content: $t('encounter.monsterManual'), animation: 'shift-away' }"
      class="flex gap-2 items-center"
      @click="isOpen = true"
    >
      <span class="md:hidden">
        {{ $t('encounter.monsterManual') }}
      </span>
      <Book class="text-info w-10 h-10" />
    </button>
    <Modal v-if="isOpen" big @close="isOpen = false">
      <FuzzyInput
        focus
        index="monsters"
        placeholder="Copper dragon"
        label="Monster"
        :disabled="isLoading"
        @hits="v => (hits = v)"
      >
        <div class="overflow-y-auto max-h-full space-y-2">
          <MonsterCard v-for="hit in hits" :key="hit.id" :monster="hit" addable @add="addMonster" />
        </div>
      </FuzzyInput>
    </Modal>
  </section>
</template>
