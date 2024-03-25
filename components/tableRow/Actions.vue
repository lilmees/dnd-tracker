<script setup lang="ts">
defineProps<{ row: Row, index: number }>()

const store = useTableStore()
</script>

<template>
  <div class="flex gap-1 justify-center">
    <button
      v-tippy="{ content: $t('components.actions.link') }"
      :aria-label="$t('actions.open')"
      class="icon-btn-info group"
      @click="() => {
        store.activeRow = row
        store.activeIndex = index
        store.activeField = 'link'
        store.activeModal = 'link-modal'
      }"
    >
      <Icon
        name="ph:link-simple-horizontal"
        class="icon-info"
        aria-hidden="true"
      />
    </button>
    <button
      v-if="!['lair'].includes(row.type)"
      v-tippy="{ content: $t('components.actions.ac') }"
      :aria-label="$t('actions.open')"
      class="icon-btn-help group"
      @click="() => {
        store.activeRow = row
        store.activeIndex = index
        store.activeField = 'ac'
        store.activeModal = 'ac-modal'
      }"
    >
      <Icon
        name="ic:outline-shield"
        class="icon-help"
        aria-hidden="true"
      />
    </button>
    <button
      v-if="!['lair'].includes(row.type)"
      v-tippy="{ content: $t('components.actions.hp') }"
      :aria-label="$t('actions.open')"
      class="icon-btn-danger group"
      @click="() => {
        store.activeRow = row
        store.activeIndex = index
        store.activeField = 'health'
        store.activeModal = 'hp-modal'
      }"
    >
      <Icon
        name="mdi:cards-heart-outline"
        class="icon-danger"
        aria-hidden="true"
      />
    </button>
    <button
      v-if="!['lair'].includes(row.type)"
      v-tippy="{ content: $t('components.actions.condition') }"
      :aria-label="$t('actions.open')"
      class="icon-btn-success group"
      @click="() => {
        store.activeRow = row
        store.activeIndex = index
        store.activeField = 'conditions'
        store.activeModal = 'condition-modal'
      }"
    >
      <Icon
        name="iconoir:round-flask"
        class="icon-success"
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
      :aria-label="$t('actions.open')"
      class="icon-btn-primary group"
      @click="() => {
        store.activeRow = row
        store.activeIndex = index
        store.activeModal = 'possible-attacks-modal'
      }"
    >
      <Icon
        name="charm:sword"
        class="icon-primary"
        aria-hidden="true"
      />
    </button>
  </div>
</template>
