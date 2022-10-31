<script setup>
const emit = defineEmits(['update'])
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
      '!bg-primary/30 tracker-shadow': index === activeIndex,
      'bg-danger/30': row.health !== null && row.health < 1,
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
      <!-- <a v-if="row.link" :href="row.link" target="_blank">
                  <Link class="w-6 h-6 cursor-pointer" v-tooltip="'Open link'" />
                </a>
                <Link v-else class="w-6 h-6 text-slate-300" />
                <Heart
                  v-tooltip="'Change health'"
                  @click="editHealth = true"
                  class="w-6 h-6 text-green-400 cursor-pointer"
                />
                <Shield v-tooltip="'Change AC'" @click="editAc = true" class="w-6 h-6 text-purple-400 cursor-pointer" />
                <Potion
                  v-tooltip="'Add condition'"
                  @click="addCondition = true"
                  class="w-6 h-6 text-blue-400 cursor-pointer"
                />
                <Fire v-tooltip="'Add curse'" @click="addCurse = true" class="w-6 h-6 text-orange-400 cursor-pointer" /> -->
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
      <div class="flex flex-wrap gap-1">
        copy
        <!-- <Copy v-tooltip="'Copy row'" class="w-6 h-6 cursor-pointer text-blue-400" @click="copyRow(index)" />
                <VDropdown>
                  <Delete v-tooltip="'Delete row'" class="w-6 h-6 cursor-pointer text-red-400" />
                  <template #popper>
                    <div class="flex flex-col gap-2 p-4">
                      <p>Are you sure you want to delete the current player/monster</p>
                      <TagButton color="red" @click="removePlayer(index)">Remove</TagButton>
                    </div>
                  </template>
                </VDropdown> -->
      </div>
    </td>
  </tr>
</template>
