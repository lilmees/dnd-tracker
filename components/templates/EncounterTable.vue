<script setup lang="ts">
const store = useTableStore()
const { $i18n } = useNuxtApp()
const keys = useMagicKeys()

whenever(keys.shift_arrowleft, () => store.prevInitiative())
whenever(keys.shift_arrowRight, () => store.nextInitiative())

const headers: ComputedRef<string[]> = computed(() => {
  const headers = [
    '',
    $i18n.t('components.encounterTable.headers.name'),
    $i18n.t('components.encounterTable.headers.init'),
    $i18n.t('components.encounterTable.headers.ac'),
    $i18n.t('components.encounterTable.headers.hp'),
    $i18n.t('components.encounterTable.headers.actions'),
    $i18n.t('components.encounterTable.headers.conditions'),
    $i18n.t('components.encounterTable.headers.note'),
    $i18n.t('components.encounterTable.headers.deathSaves'),
    'con',
    $i18n.t('components.encounterTable.headers.modify')
  ]
  if (store.includesSummond) {
    headers.splice(2, 0, $i18n.t('components.encounterTable.headers.summond'))
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
              class="py-3 px-2 bg-tracker border-b border-r last:border-r-0 border-slate-700 uppercase"
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
        class="bg-tracker w-full px-8 py-4"
      >
        {{ $t('components.encounterTable.empty') }}
      </div>
    </div>
  </section>
</template>
