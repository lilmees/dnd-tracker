<script setup>
import { createRowObject } from '@/util/createRowObject'
import { useEncountersStore } from '@/store/encounters'

const props = defineProps({
  encounter: { type: Object, required: true },
  sandbox: { type: Boolean, default: false },
})

const store = useEncountersStore()

const isOpen = ref(false)
const isLoading = ref(false)
const hits = ref([])

async function addMonster(monster) {
  try {
    isLoading.value = true
    const row = createRowObject(monster, 'monster', props.encounter.rows)
    props.encounter.rows.includes('[') ? (props.encounter.rows = [row]) : props.encounter.rows.push(row)
    if (!props.sandbox) await store.updateEncounter({ rows: props.encounter.rows }, props.encounter.id)
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
