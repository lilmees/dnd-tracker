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
  <div class="rounded-lg w-full border-4 border-primary p-3 relative space-y-1">
    <Icon
      v-if="addable"
      v-tippy="{ content: $t('actions.add') }"
      name="material-symbols:add"
      class="absolute top-1 right-1 text-success cursor-pointer w-8 h-8"
      aria-hidden="true"
      @click="$emit('add', monster)"
    />
    <div class="flex gap-x-10 gap-y-2 items-center flex-wrap">
      <h3 class="pb-2">
        {{ monster.name }}
      </h3>
      <div class="flex gap-4">
        <div
          v-tippy="{ content: 'CR' }"
          class="flex gap-1"
        >
          <Icon
            name="lucide:skull"
            class="w-6 h-6 text-warning"
            aria-hidden="true"
          />
          <p class="font-bold">
            {{ monster.challenge_rating || '_' }}
          </p>
        </div>
        <div
          v-tippy="{ content: 'AC' }"
          class="flex gap-1"
        >
          <Icon
            name="ic:outline-shield"
            class="w-6 h-6 text-help"
            aria-hidden="true"
          />
          <p class="font-bold">
            {{ monster.armor_class || '_' }}
          </p>
        </div>
        <div
          v-tippy="{ content: 'HP' }"
          class="flex gap-1"
        >
          <Icon
            name="mdi:cards-heart-outline"
            class="w-6 h-6 text-danger"
            aria-hidden="true"
          />
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
      :row="(monster as unknown as Row)"
      :class="{ 'pb-5': isOpen }"
    />
    <div class="flex justify-end pt-4">
      <button
        class="flex gap-2 btn-black"
        :aria-label="$t(`actions.read.${isOpen ? 'less' : 'more'}`)"
        @click="isOpen = !isOpen"
      >
        <p>
          {{ $t(`actions.read.${isOpen ? 'less' : 'more'}`) }}
        </p>
        <Icon
          name="tabler:chevron-down"
          class="duration-200 h-6 w-6 stroke-2"
          :class="{ 'rotate-180': isOpen }"
          aria-hidden="true"
        />
      </button>
    </div>
  </div>
</template>
