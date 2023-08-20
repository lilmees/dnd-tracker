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

watchDebounced(
  note,
  () => store.updateRow('note', note.value as never, props.row, props.index),
  { debounce: 500, maxWait: 1000 }
)
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
      <Name
        :name="row.name"
        :type="row.type"
        @update="store.updateRow('name', $event as never, row, index)"
      />
    </td>
    <td
      v-if="store.includesSummond && store.encounter.settings.rows.includes('summoner')"
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
      <Initiative
        :initiative="row.initiative || null"
        :index="row.index"
        @update="store.updateRow('initiative', $event as never, row, index)"
      />
    </td>
    <td
      v-if="store.encounter.settings.rows.includes('ac')"
      class="border-r border-slate-700"
      :class="tableSpacing"
    >
      <Ac
        :ac="row?.ac || null"
        :temp-ac="row?.tempAc || null"
        :type="row.type"
        @update="store.updateRow('ac', $event as never, row, index)"
      />
    </td>
    <td
      v-if="store.encounter.settings.rows.includes('health')"
      class="border-r border-slate-700"
      :class="tableSpacing"
    >
      <Health
        :health="typeof row.health === 'number' ? row.health : null"
        :temp-health="row.tempHealth || null"
        :type="row.type"
        @update="store.updateRow('health', $event as never, row, index)"
      />
    </td>
    <td
      class="border-r border-slate-700"
      :class="tableSpacing"
    >
      <Actions :row="row" :index="index" />
    </td>
    <td
      v-if="store.encounter.settings.rows.includes('conditions')"
      class="border-r border-slate-700"
      :class="tableSpacing"
    >
      <Effects
        :conditions="row.conditions"
        @update="store.updateRow($event.type, $event.value as never, row, index)"
      />
    </td>
    <td
      v-if="store.encounter.settings.rows.includes('note')"
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
      v-if="store.encounter.settings.rows.includes('deathSaves')"
      class="border-r border-slate-700"
      :class="tableSpacing"
    >
      <DeathSaves
        v-if="row.deathSaves"
        :death-saves="row.deathSaves"
        @update="store.updateRow('deathSaves', $event as never, row, index)"
      />
    </td>
    <td
      v-if="store.encounter.settings.rows.includes('concentration')"
      class="border-r border-slate-700"
      :class="tableSpacing"
    >
      <Concentration
        v-if="typeof row.concentration === 'boolean'"
        :concentration="row.concentration"
        @toggle="store.updateRow('concentration', !row.concentration as never, row, index)"
      />
    </td>
    <td
      v-if="store.encounter.settings.rows.includes('modify')"
      :class="tableSpacing"
    >
      <Modify
        @copy="store.encounterUpdate({
          rows:[
            ...store.encounter.rows,
            { ...store.encounter.rows.filter(r => r.id === row.id)[0], id: Date.now() }
          ]
        })"
        @delete="store.encounterUpdate({ rows: store.encounter.rows.filter(r => r.id !== row.id) })"
      />
    </td>
  </tr>
</template>
