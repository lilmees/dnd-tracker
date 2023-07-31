<script setup lang="ts">
const store = useTableStore()
const { t } = useI18n()
const keys = useMagicKeys()

// Initiative down
whenever(keys.shift_arrowleft, () => store.prevInitiative())
whenever(keys.pageUp, () => store.prevInitiative())

// Initiative down
whenever(keys.shift_arrowRight, () => store.nextInitiative())
whenever(keys.PageDown, () => store.nextInitiative())

const headers = computed<string[]>(() => {
  const headers = [
    '',
    t('components.encounterTable.headers.name'),
    t('components.encounterTable.headers.init'),
    t('components.encounterTable.headers.ac'),
    t('components.encounterTable.headers.hp'),
    t('components.encounterTable.headers.actions'),
    t('components.encounterTable.headers.conditions'),
    t('components.encounterTable.headers.note'),
    t('components.encounterTable.headers.deathSaves'),
    'con',
    t('components.encounterTable.headers.modify')
  ]
  if (store.includesSummond) {
    headers.splice(2, 0, t('components.encounterTable.headers.summond'))
  }
  return headers
})
</script>

<template>
  <section>
    <div
      class="inline-block rounded-lg overflow-x-auto overflow-y-hidden w-full"
    >
      <table class="min-w-full">
        <thead>
          <tr>
            <th
              v-for="header in headers"
              :key="header"
              class="py-3 px-2 border-b border-r last:border-r-0 border-slate-700 uppercase"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody
          v-if="store?.encounter?.rows?.length"
          v-auto-animate
        >
          <EncounterTableRow
            v-for="(row, index) in store.encounter.rows"
            :key="row!.id"
            :row="row"
            :index="index"
          />
        </tbody>
      </table>
      <div
        v-if="!store?.encounter?.rows.length"
        class="w-full px-8 py-4 text-center font-bold"
      >
        {{ $t('components.encounterTable.empty') }}
      </div>
    </div>
  </section>
</template>
