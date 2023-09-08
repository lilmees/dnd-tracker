<script setup lang="ts">
defineProps<{ row: Row }>()

const headers = ref<{ label: string, key: string }[]>([
  { label: 'Actions', key: 'actions' },
  { label: 'Legendary actions', key: 'legendary_actions' },
  { label: 'Reactions', key: 'reactions' },
  { label: 'Special abilities', key: 'special_abilities' }
])
</script>

<template>
  <section
    v-if="
      row.actions?.length
        || row.legendary_actions?.length
        || row.reactions?.length
        || row.special_abilities?.length
    "
  >
    <div
      v-for="item in headers"
      :key="item.key"
      class="first:border-t border-x border-slate-700 first:rounded-t-lg last:rounded-b-lg"
    >
      <template
        v-if="
          Array.isArray(row[item.key as keyof Row])
            && (row[item.key as keyof Row] as Action[])?.length
        "
      >
        <p class="text-center py-2 head-3">
          {{ item.label }}
        </p>
        <div class="px-2 border-y border-slate-700">
          <div
            v-for="action in (row[item.key as keyof Row] as Action[])"
            :key="action.name"
            class="flex w-full flex-col border-b border-slate-700 last:border-b-0 py-1"
          >
            <div class="flex flex-wrap gap-x-4 items-center">
              <p class="font-bold">
                {{ action.name }}:
              </p>
              <p class="body-small">
                {{ action.desc }}
              </p>
            </div>
            <div class="flex flex-wrap gap-x-4 items-center mt-2">
              <div v-if="action.attack_bonus" class="flex flex-wrap gap-x-2 items-center">
                <p class="font-bold">
                  To hit:
                </p>
                <p class="body-small">
                  +{{ action.attack_bonus }}
                </p>
              </div>
              <div v-if="action.damage_dice" class="flex flex-wrap gap-x-2 items-center">
                <p class="font-bold">
                  Dice:
                </p>
                <p class="body-small">
                  {{ action.damage_dice }}
                  <span v-if="action.damage_bonus">
                    +{{ action.damage_bonus }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>
