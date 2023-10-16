<script setup lang="ts">
const props = defineProps<{
  row: Row,
  index: number,
  tableSpacing: string
}>()

const store = useTableStore()

const note = ref<string>(props.row.note || '')

const summoner = computed<string | null>(() => {
  if (store.encounter) {
    const sum = store.encounter.rows.filter(r => r.id === props.row.summoner?.id)
    return sum.length ? sum[0].name : null
  } else {
    return null
  }
})

watchDebounced(note, () => {
  store.activeField = 'note'
  store.activeRow = props.row
  store.activeIndex = props.index
  store.updateRow(note.value as never)
}, { debounce: 500, maxWait: 1000 })

async function moveRow (up: boolean): Promise<void> {
  if (store?.encounter) {
    const rows = store.encounter.rows
    const lowestIndex = rows.findIndex(r => r.index === props.index)
    if (up) {
      rows[lowestIndex].index = lowestIndex - 1
      rows[lowestIndex - 1].index = lowestIndex
      // update the follwing indexes
      for (let i = lowestIndex + 1; i < rows.length; i++) {
        rows[i].index = i
      }
    } else {
      rows[lowestIndex].index = lowestIndex + 1
      rows[lowestIndex + 1].index = lowestIndex
    }
    await store.encounterUpdate({
      rows: rows.sort((a, b) => a.index - b.index)
    })
  }
}
</script>

<template>
  <tr
    v-if="store.encounter"
    class="border-b last:border-b-0 border-slate-700"
    :class="{
      'bg-primary/10': index === store.encounter.activeIndex,
      'bg-danger/10': row.health !== null && row.health === 0,
    }"
  >
    <td
      class="border-r border-slate-700 text-info text-center max-w-[30px]"
      :class="tableSpacing"
    >
      {{ row.index + 1 }}
    </td>
    <td
      class="border-r border-slate-700"
      :class="tableSpacing"
    >
      <div class="flex gap-2 items-center pl-4">
        <Icon
          :name="useHomebrewIcon(row.type)"
          :class="useHomebrewColor(row.type)"
          size="20"
          class="min-w-[20px]"
          aria-hidden="true"
        />
        <p
          class="peer cursor-pointer"
          @click="() => {
            store.activeRow = row
            store.activeIndex = index
            store.activeField = 'name'
            store.activeModal = 'name'
          }"
        >
          {{ row.name }}
        </p>
        <Icon
          name="lucide:wrench"
          class="w-4 h-4 opacity-0 peer-hover:opacity-100 duration-200 ease-in-out"
          aria-hidden="true"
        />
      </div>
    </td>
    <td
      v-if="
        store.includesSummond &&
          (!store.encounter.settings.modified || store.encounter.settings.rows.includes('summoner'))
      "
      class="border-r border-slate-700"
      :class="tableSpacing"
    >
      <div v-if="row.summoner?.id && summoner">
        {{ summoner }}
      </div>
    </td>
    <td
      class="border-r border-slate-700"
      :class="tableSpacing"
    >
      <div class="flex justify-between gap-2">
        <div
          class="flex gap-2 items-center"
          @click="() => {
            store.activeRow = row
            store.activeIndex = index
            store.activeField = 'initiative'
            store.activeModal = 'initiative'
          }"
        >
          <p
            v-if="row.initiative !== null && row.initiative >= 0"
            class="peer cursor-pointer"
          >
            {{ row.initiative }}
          </p>
          <p
            v-else
            class="text-slate-600 cursor-pointer"
          >
            Add
          </p>
          <Icon
            name="lucide:wrench"
            class="w-4 h-4 opacity-0 peer-hover:opacity-100 duration-200 ease-in-out"
            :class="{ hidden: !row.initiative }"
            aria-hidden="true"
          />
        </div>
        <div
          v-if="row.initiative !== null && row.initiative >= 0"
          class="flex gap-1 items-center"
        >
          <Icon
            v-if="
              store.encounter
                && store.encounter.rows.length !== index + 1
                && store.encounter.rows[index + 1].initiative === row.initiative
            "
            name="ph:arrow-down"
            class="w-6 h-6 cursor-pointer text-secondary"
            aria-hidden="true"
            @click="moveRow(false)"
          />
          <Icon
            v-if="store.encounter
              && index > 0
              && store.encounter.rows[index - 1]?.initiative === row.initiative"
            name="ph:arrow-up"
            class="w-6 h-6 cursor-pointer text-secondary"
            aria-hidden="true"
            @click="moveRow(true)"
          />
        </div>
      </div>
    </td>
    <td
      v-if="!store.encounter.settings.modified || store.encounter.settings.rows.includes('ac')"
      class="border-r border-slate-700"
      :class="tableSpacing"
    >
      <div class="flex gap-2 items-center">
        <div
          class="peer cursor-pointer flex gap-1"
          @click="() => {
            store.activeRow = row
            store.activeIndex = index
            store.activeField = 'ac'
            store.activeModal = 'ac'
          }"
        >
          <p v-if="row.ac !== null">
            {{ row.ac }}
          </p>
          <p
            v-else-if="row.type !== 'lair'"
            class="text-slate-600"
          >
            Add
          </p>
          <span
            v-if="row.ac !== null && row.tempAc"
            class="text-warning"
          >+{{ row.tempAc }}</span>
        </div>
        <Icon
          name="lucide:wrench"
          class="w-4 h-4 opacity-0 peer-hover:opacity-100 duration-200 ease-in-out"
          :class="{ hidden: !row.ac }"
          aria-hidden="true"
        />
      </div>
    </td>
    <td
      v-if="!store.encounter.settings.modified || store.encounter.settings.rows.includes('health')"
      class="border-r border-slate-700"
      :class="tableSpacing"
    >
      <div class="flex gap-2 items-center">
        <div
          class="peer cursor-pointer flex gap-1"
          @click="() => {
            store.activeRow = row
            store.activeIndex = index
            store.activeField = 'health'
            store.activeModal = 'hp'
          }"
        >
          <p
            v-if="row.health !== null"
            :class="{
              'text-danger font-bold': typeof row.health === 'number' && +row.health < 1
            }"
          >
            {{ row.health }}
          </p>
          <p v-else-if="row.type !== 'lair'" class="text-slate-600">
            Add
          </p>
          <span
            v-if="row.health !== null && row.tempHealth"
            class="text-warning"
          >+{{ row.tempHealth }}</span>
        </div>
        <Icon
          name="lucide:wrench"
          class="w-4 h-4 opacity-0 peer-hover:opacity-100 duration-200 ease-in-out"
          :class="{ hidden: !row.health }"
          aria-hidden="true"
        />
      </div>
    </td>
    <td
      class="border-r border-slate-700"
      :class="tableSpacing"
    >
      <Actions :row="row" :index="index" />
    </td>
    <td
      v-if="!store.encounter.settings.modified || store.encounter.settings.rows.includes('conditions')"
      class="border-r border-slate-700"
      :class="tableSpacing"
    >
      <Effects
        :conditions="row.conditions"
        @update="(v) => {
          store.activeRow = row
          store.activeIndex = index
          store.activeField = 'conditions'
          store.updateRow(v as never)
        }"
      />
    </td>
    <td
      v-if="!store.encounter.settings.modified || store.encounter.settings.rows.includes('note')"
      class="border-r border-slate-700 min-w-[150px] min-h-[50px] relative"
    >
      <textarea
        v-model="note"
        placeholder="Note"
        class="border-none outline-none text-white body-small placeholder-slate-400 bg-transparent w-full absolute inset-0 resize-none"
        :class="tableSpacing"
      />
    </td>
    <td
      v-if="!store.encounter.settings.modified || store.encounter.settings.rows.includes('deathSaves')"
      class="border-r border-slate-700"
      :class="tableSpacing"
    >
      <DeathSaves
        v-if="row.deathSaves"
        :death-saves="row.deathSaves"
        @update="(v) => {
          store.activeRow = row
          store.activeIndex = index
          store.activeField = 'deathSaves'
          store.updateRow(v as never)
        }"
      />
    </td>
    <td
      v-if="!store.encounter.settings.modified || store.encounter.settings.rows.includes('concentration')"
      class="border-r border-slate-700"
      :class="tableSpacing"
    >
      <Concentration
        v-if="typeof row.concentration === 'boolean'"
        :concentration="row.concentration"
        @toggle="() => {
          store.activeRow = row
          store.activeIndex = index
          store.activeField = 'concentration'
          store.updateRow(!row.concentration as never)
        }"
      />
    </td>
    <td
      v-if="!store.encounter.settings.modified || store.encounter.settings.rows.includes('modify')"
      :class="tableSpacing"
    >
      <Modify
        @copy="store.encounterUpdate({
          rows:[
            ...store.encounter.rows,
            { ...store.encounter.rows.filter(r => r.id === row.id)[0], id: Date.now() }
          ]
        })"
        @delete="store.encounterUpdate({
          rows: store.encounter.rows.filter(r => r.id !== row.id)
        })"
      />
    </td>
  </tr>
</template>
