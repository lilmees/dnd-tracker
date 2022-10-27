<script setup>
defineProps({ encounter: { type: Object, required: true } })
</script>

<template>
  <div
    class="rounded-xl p-4 flex flex-col gap-2 justify-between tracker-shadow min-w-[250px] max-w-md cursor-pointer"
    :style="{ 'background-color': encounter.background, color: encounter.color }"
  >
    <h2>{{ encounter.title }}</h2>
    <div>
      <p v-if="encounter.profiles">Creator: {{ encounter.profiles.username }}</p>
      <p>Rows: {{ encounter.rows.length }}</p>
    </div>
  </div>
</template>
