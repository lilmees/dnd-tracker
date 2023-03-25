<script setup>
import { useTableStore } from '@/store/table'

const props = defineProps({
  row: { type: Object, required: true },
  index: { type: Number, required: true },
})

const store = useTableStore()

const note = ref(props.row.note)

const summoner = computed(() => {
  const sum = store.encounter.rows.filter(r => r.id === props.row.summoner?.id)
  return sum.length ? sum[0].name : null
})

watchDebounced(
  note, 
  () => store.updateRow('note', note.value, props.row, props.index), 
  { debounce: 500, maxWait: 1000 }
)
</script>

<template>
  <tr
    class="border-b last:border-b-0 border-slate-700"
    :class="{
      '!bg-primary/10 tracker-shadow': index === store.encounter.activeIndex,
      'bg-danger/10': row.health !== null && row.health < 1,
    }"
  >
    <td class="px-2 py-1 border-r border-slate-700 text-primary text-center max-w-[30px]">
      {{ row.index + 1 }}
    </td>
    <td class="px-2 py-1 border-r border-slate-700">
      <Name :name="row.name" :type="row.type" @update="store.updateRow('name', $event, row, index)" />
    </td>
    <td v-if="store.includesSummond" class="px-2 py-1 border-r border-slate-700">
      <div v-if="row.summoner?.id && summoner">{{ summoner }}</div>
    </td>
    <td class="px-2 py-1 border-r border-slate-700">
      <Initiative
        :initiative="row.initiative || null"
        :index="row.index"
        @update="store.updateRow('initiative', $event, row, index)"
      />
    </td>
    <td class="px-2 py-1 border-r border-slate-700">
      <Ac 
        :ac="row.ac || null" :tempAc="row.tempAc || null" 
        :type="row.type" 
        @update="store.updateRow('ac', $event, row, index)" 
      />
    </td>
    <td class="p-2 border-r border-slate-700">
      <Health
        :health="typeof row.health === 'number' ? row.health : null"
        :tempHealth="row.tempHealth || null"
        :type="row.type"
        @update="store.updateRow('health', $event, row, index)"
      />
    </td>
    <td class="p-2 border-r border-slate-700">
      <Actions :row="row" />
    </td>
    <td class="px-2 py-1 border-r border-slate-700">
      <Effects 
        :conditions="row.conditions" 
        @update="store.updateRow($event.type, $event.value, row, index)" 
      />
    </td>
    <td class="border-r border-slate-700 min-w-[150px] min-h-[50px] relative">
      <textarea
      v-model="note"
      placeholder="Note"
      class="border-none outline-none text-white body-small placeholder-slate-400 bg-transparent w-full p-2 absolute inset-0 resize-none"
     />
    </td>
    <td class="px-2 py-1 border-r border-slate-700">
      <DeathSaves 
        v-if="row.deathSaves" 
        :deathSaves="row.deathSaves" 
        @update="store.updateRow('deathSaves', $event, row, index)" 
      />
    </td>
    <td class="px-2 py-1 border-r border-slate-700">
      <Concentration
        v-if="typeof row.concentration === 'boolean'"
        :concentration="row.concentration"
        @toggle="store.updateRow('concentration', !row.concentration, row, index)"
      />
    </td>
    <td class="px-2 py-1">
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
