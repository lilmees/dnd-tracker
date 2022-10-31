<script setup>
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['update'])
const props = defineProps({
  rows: { type: Array, required: true },
  activeIndex: { type: Number, required: true },
})

const { t } = useI18n({ useScope: 'global' })
const headers = ref([
  t('encounter.headers.name'),
  t('encounter.headers.init'),
  t('encounter.headers.ac'),
  t('encounter.headers.hp'),
  t('encounter.headers.actions'),
  t('encounter.headers.conditions'),
  t('encounter.headers.deathSaves'),
  t('encounter.headers.concentration'),
  t('encounter.headers.modify'),
])

function updateRow(row, index) {
  props.rows[index] = row
  emit('update', props.rows)
}
</script>

<template>
  <section>
    <div class="inline-block tracker-shadow rounded-xl overflow-x-auto w-full">
      <table class="min-w-full">
        <thead>
          <tr>
            <th v-for="header in headers" :key="header" class="py-3 bg-tracker border-b border-primary uppercase">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody v-if="rows.length > 0">
          <EncounterTableRow
            v-for="(row, index) in rows"
            :key="row.id"
            :row="row"
            :activeIndex="activeIndex"
            :index="index"
            @update="updateRow($event, index)"
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
