<script setup>
const emit = defineEmits(['update', 'copy', 'delete', 'index'])
const props = defineProps({
  row: { type: Object, required: true },
  activeIndex: { type: Number, required: true },
  index: { type: Number, required: true },
  rows: { type: Array, required: true },
  includesSummond: { type: Boolean, required: true },
  showcase: { type: Boolean, default: false },
})

function updateRow(key, value) {
  props.row[key] = value
  // when updateing health or ac also update the max values
  if (key === 'health' || key === 'ac') {
    props.row[`max${key.charAt(0).toUpperCase() + key.slice(1)}`] = value
  }
  emit('update', props.row)
}
</script>

<template>
  <tr
    class="border-b last:border-b-0 border-slate-700"
    :class="{
      '!bg-primary/10 tracker-shadow': index === activeIndex,
      'bg-danger/10': row.health !== null && row.health < 1,
    }"
  >
    <td class="px-2 py-1 border-r border-slate-700 text-primary text-center max-w-[30px]">
      {{ row.index + 1 }}
    </td>
    <td class="px-2 py-1 border-r border-slate-700">
      <Name :name="row.name" :type="row.type" @update="updateRow('name', $event)" />
    </td>
    <td v-if="includesSummond" class="px-2 py-1 border-r border-slate-700">
      <p v-if="row.summoner?.name">{{ row.summoner.name }}</p>
    </td>
    <td class="px-2 py-1 border-r border-slate-700">
      <Initiative
        :initiative="row.initiative || null"
        :index="row.index"
        :rows="rows"
        @update="updateRow('initiative', $event)"
        @index="$emit('index', $event)"
      />
    </td>
    <td class="px-2 py-1 border-r border-slate-700">
      <Ac :ac="row.ac || null" :tempAc="row.tempAc || null" :type="row.type" @update="updateRow('ac', $event)" />
    </td>
    <td class="p-2 border-r border-slate-700">
      <Health
        :health="typeof row.health === 'number' ? row.health : null"
        :tempHealth="row.tempHealth || null"
        :type="row.type"
        @update="updateRow('health', $event)"
      />
    </td>
    <td class="p-2 border-r border-slate-700">
      <Actions :showcase="showcase" :row="row" @update="$emit('update', $event)" />
    </td>
    <td class="px-2 py-1 border-r border-slate-700">
      <Effects :conditions="row.conditions" :curses="row.curses" @update="updateRow($event.type, $event.value)" />
    </td>
    <td class="px-2 py-1 border-r border-slate-700">
      <DeathSaves v-if="row.deathSaves" :deathSaves="row.deathSaves" @update="updateRow('deathSaves', $event)" />
    </td>
    <td class="px-2 py-1 border-r border-slate-700">
      <Concentration
        v-if="typeof row.concentration === 'boolean'"
        :concentration="row.concentration"
        @toggle="updateRow('concentration', !row.concentration)"
      />
    </td>
    <td class="px-2 py-1">
      <Modify :showcase="showcase" @copy="$emit('copy', row.id)" @delete="$emit('delete', row.id)" />
    </td>
  </tr>
</template>
