<script setup>
import { correctRowItemIndexes } from '@/util/correctRowItemIndexes'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['update'])
const props = defineProps({
  rows: { type: Array, required: true },
  activeIndex: { type: Number, required: true },
})

const { t } = useI18n({ useScope: 'global' })
const includesSummond = computed(() => !!props.rows.flat().filter(r => r.summoner).length)
const sorted = computed(() => props.rows.sort((a, b) => a.index - b.index))
const headers = computed(() => {
  const headers = [
    '',
    t('encounter.headers.name'),
    t('encounter.headers.init'),
    t('encounter.headers.ac'),
    t('encounter.headers.hp'),
    t('encounter.headers.actions'),
    t('encounter.headers.conditions'),
    t('encounter.headers.deathSaves'),
    t('encounter.headers.concentration'),
    t('encounter.headers.modify'),
  ]
  if (includesSummond.value) headers.splice(2, 0, t('encounter.headers.summond'))
  return headers
})

onMounted(() => checkIfIndexAreCorrect(props.rows))

watch(sorted, v => {
  if (v) checkIfIndexAreCorrect(props.rows)
})

onMounted(() => {
  if (props.rows !== sorted.value) emit('update', sorted.value)
})

function updateRow(row, index) {
  props.rows[index] = row
  emit('update', sorted.value)
}

function updateIndexes(rows) {
  emit('update', rows)
}

function checkIfIndexAreCorrect(rows) {
  const indexes = rows.map(r => r.index).sort((a, b) => a - b)
  if (JSON.stringify(indexes) === JSON.stringify([...Array(indexes.at(-1) + 1).keys()])) return
  emit('update', correctRowItemIndexes(rows))
}
</script>

<template>
  <section>
    <div class="inline-block tracker-shadow rounded-xl overflow-x-auto w-full">
      <table class="min-w-full">
        <thead>
          <tr>
            <th
              v-for="header in headers"
              :key="header"
              class="py-3 px-2 bg-tracker border-b border-r last:border-r-0 border-slate-700 uppercase"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody v-auto-animate v-if="rows.length > 0">
          <EncounterTableRow
            v-for="(row, index) in sorted"
            :key="row.id"
            :row="row"
            :activeIndex="activeIndex"
            :includesSummond="includesSummond"
            :index="index"
            :rows="props.rows"
            @update="updateRow($event, index)"
            @index="updateIndexes"
            @copy="emit('update', [...rows, { ...rows.filter(r => r.id === $event)[0], id: Date.now() }])"
            @delete="
              $emit(
                'update',
                rows.filter(r => r.id !== $event)
              )
            "
          />
        </tbody>
      </table>
    </div>
  </section>
</template>
