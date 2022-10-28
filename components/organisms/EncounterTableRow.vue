<script setup>
const emit = defineEmits(['update'])
const props = defineProps({
  row: { type: Object, required: true },
  activeIndex: { type: Number, required: true },
  index: { type: Number, required: true },
})

function updateName(name) {
  props.row.name = name
  emit('update', props.row)
}

function updateInitiative(initiative) {
  props.row.initiative = initiative
  emit('update', props.row)
}

function updateAc(ac) {
  props.row.ac = ac
  emit('update', props.row)
}

function updateHealth(health) {
  props.row.health = health
  emit('update', props.row)
}

function updateDeathSaves(deathSaves) {
  props.row.deathSaves = deathSaves
  emit('update', props.row)
}

function updateConcentration() {
  props.row.concentration = !props.row.concentration
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
      <Name :name="row.name" @update="updateName" />
    </td>
    <td class="px-2 py-1">
      <Initiative :initiative="row.initiative" @update="updateInitiative" />
    </td>
    <td class="px-2 py-1">
      <Ac :ac="row.ac" :tempAc="row.tempAc" @update="updateAc" />
    </td>
    <td class="p-2">
      <Health :health="row.health" :tempHealth="row.tempHealth" @update="updateHealth" />
    </td>
    <td class="p-2">
      <div class="flex gap-1">
        actions
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
      </div>
    </td>
    <td class="px-2 py-1">
      <div class="flex flex-col gap-1">
        conditions
        <!-- <div v-if="conditions" class="flex flex-col gap-1">
                  tags
                  <Tag
                    removable
                    @remove="removeCondition($event, index)"
                    v-for="condition in row.conditions"
                    :key="condition"
                    :condition="conditions[condition]"
                  />
                </div> -->
        <div v-if="row.curses?.length > 0" class="flex flex-col gap-1">
          curse
          <!-- <Curse
                    removable
                    @remove="removeCurse($event, index)"
                    v-for="curse in row.curses"
                    :curse="curse"
                    :key="curse.name"
                  /> -->
        </div>
      </div>
    </td>
    <td class="px-2 py-1">
      <DeathSaves :deathSaves="row.deathSaves" @update="updateDeathSaves" />
    </td>
    <td class="px-2 py-1">
      <Concentration :concentration="row.concentration" @toggle="updateConcentration" />
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
