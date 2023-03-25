<script setup>
import { useTableStore } from '@/store/table'
import { useI18n } from 'vue-i18n'

const store = useTableStore()
const { t } = useI18n({ useScope: 'global' })

const headers = computed(() => {
  const headers = [
    '',
    t('encounter.headers.name'),
    t('encounter.headers.init'),
    t('encounter.headers.ac'),
    t('encounter.headers.hp'),
    t('encounter.headers.actions'),
    t('encounter.headers.conditions'),
    t('encounter.headers.note'),
    t('encounter.headers.deathSaves'),
    'con',
    t('encounter.headers.modify'),
  ]
  if (store.includesSummond) headers.splice(2, 0, t('encounter.headers.summond'))
  return headers
})
</script>

<template>
  <section>
    <div class="inline-block tracker-shadow rounded-xl overflow-x-auto w-full">
      <table class="min-w-full">
        <thead>
          <tr>
            <th
              v-for="header in headers"
              v-tippy="header === 'con' ? $t('encounter.headers.concentration') : ''"
              :key="header"
              class="py-3 px-2 bg-tracker border-b border-r last:border-r-0 border-slate-700 uppercase"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody v-auto-animate v-if="store.encounter.rows.length > 0">
          <EncounterTableRow
            v-for="(row, index) in store.encounter.rows"
            :key="row.id"
            :row="row"
            :index="index"           
          />
        </tbody>
      </table>
      <div 
        v-if="!store.encounter.rows.length"  
        class="bg-tracker w-full px-8 py-4"
      >
        {{ $t('encounter.empty') }}
      </div>
    </div>
  </section>
</template>
