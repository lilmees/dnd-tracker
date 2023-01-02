<script setup>
import Add from '~/assets/icons/add.svg'
import Shield from '@/assets/icons/shield.svg'
import Heart from '@/assets/icons/heart.svg'
import ChevronDown from '~/assets/icons/chevron-down.svg'

defineEmits(['add'])
defineProps({
  monster: { type: Object, required: true },
  addable: { type: Boolean, default: false },
})

const abilities = ref(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'])
const abilitiesNames = ref(['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'])
const stats = ref(['type', 'subtype', 'size', 'alignment', 'xp'])
const isOpen = ref(false)
</script>

<template>
  <div class="rounded-xl w-full bg-black p-3 relative space-y-1">
    <Add
      v-if="addable"
      class="absolute top-1 right-1 text-success cursor-pointer w-8 h-8"
      @click="$emit('add', monster)"
    />
    <div class="flex gap-x-10 gap-y-2 items-center flex-wrap">
      <h3>
        {{ monster.name }}
      </h3>
      <div class="flex gap-4">
        <div class="flex gap-1">
          <p class="font-bold">{{ monster.armor_class || '_' }}</p>
          <Shield class="w-6 h-6 text-help" />
        </div>
        <div class="flex gap-1">
          <p class="font-bold">{{ monster.hit_points || '_' }}</p>
          <Heart class="w-6 h-6 text-danger" />
        </div>
      </div>
    </div>
    <div class="flex gap-x-4 gap-y-1 flex-wrap">
      <div v-for="(ability, index) in abilities" :key="ability" class="flex gap-1">
        <p>{{ ability }}:</p>
        <p class="font-bold">{{ monster[abilitiesNames[index]] || '_' }}</p>
      </div>
    </div>
    <div class="flex gap-x-4 gap-y-1 flex-wrap">
      <template v-for="stat in stats" :key="stat">
        <div v-if="monster[stat]" class="flex gap-1">
          <p>{{ stat }}:</p>
          <p>{{ monster[stat] || '_' }}</p>
        </div>
      </template>
    </div>
    <ActionsTable v-if="monster.actions && isOpen" :actions="JSON.parse(monster.actions)" :class="{ 'pb-5': isOpen }" />
    <ChevronDown
      class="cursor-pointer duration-200 h-6 w-6 stroke-2 absolute bottom-1 right-1"
      :class="{ 'rotate-180': isOpen }"
      @click="isOpen = !isOpen"
    />
  </div>
</template>
