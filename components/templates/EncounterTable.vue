<script setup lang="ts">
const store = useTableStore()
const { t } = useI18n()

const quickInit = ref<boolean>(false)

// Initiative down
onKeyStroke(['ArrowLeft', 'PageDown'], (e) => {
  e.preventDefault()
  if (e.shiftKey || e.metaKey || e.key === 'PageDown') {
    store.prevInitiative()
  }
})

// Initiative up
onKeyStroke(['ArrowRight', 'PageUp'], (e) => {
  e.preventDefault()
  if (e.shiftKey || e.metaKey || e.key === 'PageUp') {
    store.nextInitiative()
  }
})

const headers = computed<string[]>(() => {
  const always = ['name', 'init', 'manage']
  const options = ['name', 'summoner', 'init', 'ac', 'health', 'manage', 'conditions', 'note', 'deathSaves', 'concentration', 'modify']

  const headers = ['']

  options.forEach((option: string) => {
    if (always.includes(option)) {
      headers.push(t(`components.encounterTable.headers.${option}`))
    } else if (!store.encounter?.settings.modified || store.encounter?.settings.rows.includes(option)) {
      if (store.includesSummond && option === 'summoner') {
        headers.push(t('components.encounterTable.headers.summoner'))
      } else if (option !== 'summoner') {
        headers.push(t(`components.encounterTable.headers.${option}`))
      }
    }
  })

  return headers
})

const tableSpacing = computed<string>(() => {
  const style: Obj = {
    compact: 'px-1 py-0',
    normal: 'px-2 py-1',
    cozy: 'px-3 py-2'
  }

  return style[store.encounter?.settings.spacing || 'normal']
})
</script>

<template>
  <section>
    <div class="inline-block rounded-lg overflow-x-auto overflow-y-hidden w-full">
      <table class="min-w-full">
        <thead>
          <tr>
            <th
              v-for="header in headers"
              :key="header"
              class="py-3 px-2 border-b border-r last:border-r-0 border-slate-700 uppercase"
              scope="col"
            >
              <div class="flex justify-center gap-2">
                {{ header }}
                <button
                  v-if="header === 'Init'"
                  v-tippy="$t('components.encounterTable.quick')"
                  :aria-label="$t('components.encounterTable.quick')"
                  :disabled="!store?.encounter?.rows?.length"
                  class="icon-btn-warning group"
                  @click="quickInit = true"
                >
                  <Icon
                    id="tour-12"
                    name="ph:lightning-fill"
                    class="icon w-5 h-5 text-warning"
                    aria-hidden="true"
                  />
                </button>
              </div>
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
            :table-spacing="tableSpacing"
          />
        </tbody>
      </table>
      <div
        v-if="!store?.encounter?.rows.length"
        class="w-full px-8 py-20 text-center head-3"
      >
        {{ $t('components.encounterTable.empty') }}
      </div>
    </div>
    <component
      :is="store.activeModal"
      :open="store.activeModal"
      @update="store.updateRow($event as never)"
      @close="store.resetActiveState()"
    />
    <QuickInitiativeModal v-if="quickInit" @close="quickInit = false" />
  </section>
</template>
