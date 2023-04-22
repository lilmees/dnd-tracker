<script setup>
import { useTableStore } from '@/store/table'

const store = useTableStore()
const { $i18n } = useNuxtApp()

const headers = computed(() => {
  const headers = [
    '',
    $i18n.t('encounter.headers.name'),
    $i18n.t('encounter.headers.init'),
    $i18n.t('encounter.headers.ac'),
    $i18n.t('encounter.headers.hp'),
    $i18n.t('encounter.headers.actions'),
    $i18n.t('encounter.headers.conditions'),
    $i18n.t('encounter.headers.note'),
    $i18n.t('encounter.headers.deathSaves'),
    'con',
    $i18n.t('encounter.headers.modify')
  ]
  if (store.includesSummond) {
    headers.splice(2, 0, $i18n.t('encounter.headers.summond'))
  }
  return headers
})
</script>

<template>
  <section>
    <div
      class="inline-block rounded-xl overflow-x-auto overflow-y-hidden w-full"
      :class="{'tracker-shadow': !store.isSandbox}"
    >
      <table class="min-w-full">
        <thead>
          <tr>
            <th
              v-for="header in headers"
              :key="header"
              v-tippy="{
                content: header === 'con'
                  ? $t('encounter.headers.concentration')
                  : '',
                animation: 'shift-away'
              }"
              class="py-3 px-2 bg-tracker border-b border-r last:border-r-0 border-slate-700 uppercase"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody v-if="store.encounter.rows.length > 0" v-auto-animate>
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
