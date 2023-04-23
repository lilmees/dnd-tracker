<script setup>
defineProps({ monster: { type: Object, required: true } })

const headers = [
  { label: 'Actions', key: 'actions' },
  { label: 'Legendary actions', key: 'legendary_actions' },
  { label: 'Reactions', key: 'reactions' },
  { label: 'Special abilities', key: 'special_abilities' }
]
</script>

<template>
  <section v-if="monster.actions.length">
    <div
      v-for="item in headers"
      :key="item.key"
      class="first:border-t border-x border-slate-700 first:rounded-t-md last:rounded-b-md"
    >
      <template v-if="monster[item.key]?.length">
        <p
          class="font-bold text-center py-1"
        >
          {{ item.label }}
        </p>
        <div class="px-2 border-y border-slate-700">
          <div
            v-for="action in monster[item.key]"
            :key="action.name"
            class="flex flex-wrap gap-x-4 items-center border-b border-slate-700 last:border-b-0 py-1"
          >
            <p class="font-bold">
              {{ action.name }}:
            </p>
            <p class="body-small">
              {{ action.desc }}
            </p>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>
