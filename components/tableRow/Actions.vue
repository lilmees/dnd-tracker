<script setup lang="ts">
defineProps<{ row: Row, index: number }>()

const store = useTableStore()
</script>

<template>
  <div class="flex gap-1 justify-center">
    <button
      v-tippy="{ content: $t('components.actions.link') }"
      :aria-label="$t('actions.open')"
      @click="() => {
        store.activeRow = row
        store.activeIndex = index
        store.activeField = 'link'
        store.activeModal = 'link-modal'
      }"
    >
      <Icon
        name="ph:link-simple-horizontal"
        class="w-6 h-6 text-info"
        aria-hidden="true"
      />
    </button>
    <button
      v-if="!['lair'].includes(row.type)"
      v-tippy="{ content: $t('components.actions.ac') }"
      :aria-label="$t('actions.open')"
      @click="() => {
        store.activeRow = row
        store.activeIndex = index
        store.activeField = 'ac'
        store.activeModal = 'ac-modal'
      }"
    >
      <Icon
        name="ic:outline-shield"
        class="w-6 h-6 cursor-pointer text-help"
        aria-hidden="true"
      />
    </button>
    <button
      v-if="!['lair'].includes(row.type)"
      v-tippy="{ content: $t('components.actions.hp') }"
      :aria-label="$t('actions.open')"
      @click="() => {
        store.activeRow = row
        store.activeIndex = index
        store.activeField = 'health'
        store.activeModal = 'hp-modal'
      }"
    >
      <Icon
        name="mdi:cards-heart-outline"
        class="w-6 h-6 cursor-pointer text-danger"
        aria-hidden="true"
      />
    </button>
    <button
      v-if="!['lair'].includes(row.type)"
      v-tippy="{ content: $t('components.actions.condition') }"
      :aria-label="$t('actions.open')"
      @click="() => {
        store.activeRow = row
        store.activeIndex = index
        store.activeField = 'conditions'
        store.activeModal = 'condition-modal'
      }"
    >
      <Icon
        name="iconoir:round-flask"
        class="w-6 h-6 cursor-pointer text-success"
        aria-hidden="true"
      />
    </button>
    <button
      v-if="
        row.actions?.length
          || row.legendary_actions?.length
          || row.reactions?.length
          || row.special_abilities?.length
      "
      v-tippy="{ content: $t('components.actions.attacks') }"
      class="flex flex-wrap items-center gap-x-2"
      @click="() => {
        store.activeRow = row
        store.activeIndex = index
        store.activeModal = 'possible-attacks-modal'
      }"
    >
      <Icon
        name="charm:sword"
        class="w-6 h-6 text-primary"
        aria-hidden="true"
      />
    </button>
  </div>
</template>
