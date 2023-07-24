<script setup lang="ts">
defineEmits(['add'])
withDefaults(
  defineProps<{ monster: Monster, addable?: boolean}>(), {
    addable: false
  }
)

const abilities = ref<string[]>(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'])
const abilitiesNames = ref<string[]>(['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'])
const stats = ref<string[]>(['type', 'subtype', 'size', 'alignment', 'xp'])
const isOpen = ref<boolean>(false)
</script>

<template>
  <div class="rounded-lg w-full bg-background p-3 relative space-y-1">
    <Icon
      v-if="addable"
      v-tippy="{ content: $t('actions.add'), animation: 'shift-away' }"
      name="material-symbols:add"
      class="absolute top-1 right-1 text-success cursor-pointer w-8 h-8"
      @click="$emit('add', monster)"
    />
    <div class="flex gap-x-10 gap-y-2 items-center flex-wrap">
      <h3 class="pb-2">
        {{ monster.name }}
      </h3>
      <div class="flex gap-4">
        <div
          v-tippy="{ content: 'CR', animation: 'shift-away' }"
          class="flex gap-1"
        >
          <Icon name="lucide:skull" class="w-6 h-6 text-warning" />
          <p class="font-bold">
            {{ monster.challenge_rating || '_' }}
          </p>
        </div>
        <div
          v-tippy="{ content: 'AC', animation: 'shift-away' }"
          class="flex gap-1"
        >
          <Icon name="ic:outline-shield" class="w-6 h-6 text-help" />
          <p class="font-bold">
            {{ monster.armor_class || '_' }}
          </p>
        </div>
        <div
          v-tippy="{ content: 'HP', animation: 'shift-away' }"
          class="flex gap-1"
        >
          <Icon name="mdi:cards-heart-outline" class="w-6 h-6 text-danger" />
          <p class="font-bold">
            {{ monster.hit_points || '_' }}
          </p>
        </div>
      </div>
    </div>
    <div class="flex gap-x-4 gap-y-1 flex-wrap">
      <div v-for="(ability, index) in abilities" :key="ability" class="flex gap-1">
        <p>{{ ability }}:</p>
        <p class="font-bold">
          {{ monster[abilitiesNames[index] as keyof Monster] || '_' }}
        </p>
      </div>
    </div>
    <div class="flex gap-x-4 gap-y-1 flex-wrap">
      <template v-for="stat in stats" :key="stat">
        <div v-if="monster[stat as keyof Monster]" class="flex gap-1">
          <p>
            {{ stat }}:
          </p>
          <p class="lowercase">
            {{ monster[stat as keyof Monster] || '_' }}
          </p>
        </div>
      </template>
    </div>
    <ActionsTable
      v-if="monster.actions && isOpen"
      :monster="monster"
      :class="{ 'pb-5': isOpen }"
    />
    <Icon
      name="tabler:chevron-down"
      class="cursor-pointer duration-200 h-6 w-6 stroke-2 absolute bottom-1 right-1"
      :class="{ 'rotate-180': isOpen }"
      @click="isOpen = !isOpen"
    />
  </div>
</template>
