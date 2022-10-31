<script setup>
const emit = defineEmits(['update', 'copy', 'delete'])
const props = defineProps({
  row: { type: Object, required: true },
  activeIndex: { type: Number, required: true },
  index: { type: Number, required: true },
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
    class="border-b border-primary"
    :class="{
      '!bg-primary/20 tracker-shadow': index === activeIndex,
      'bg-danger/20': row.health !== null && row.health < 1,
    }"
  >
    <td class="px-2 py-1">
      <Name :name="row.name" @update="updateRow('name', $event)" />
    </td>
    <td class="px-2 py-1">
      <Initiative :initiative="row.initiative" @update="updateRow('initiative', $event)" />
    </td>
    <td class="px-2 py-1">
      <Ac :ac="row.ac" :tempAc="row.tempAc" @update="updateRow('ac', $event)" />
    </td>
    <td class="p-2">
      <Health :health="row.health" :tempHealth="row.tempHealth" @update="updateRow('health', $event)" />
    </td>
    <td class="p-2">
      <Actions :row="row" @update="$emit('update', $event)" />
    </td>
    <td class="px-2 py-1">
      <Effects :conditions="row.conditions" :curses="row.curses" @update="updateRow($event.type, $event.value)" />
    </td>
    <td class="px-2 py-1">
      <DeathSaves :deathSaves="row.deathSaves" @update="updateRow('deathSaves', $event)" />
    </td>
    <td class="px-2 py-1">
      <Concentration :concentration="row.concentration" @toggle="updateRow('concentration', !row.concentration)" />
    </td>
    <td class="px-2 py-1">
      <Modify @copy="$emit('copy', row.id)" @delete="$emit('delete', row.id)" />
    </td>
  </tr>
</template>
