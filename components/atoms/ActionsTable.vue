<script setup lang="ts">
defineProps<{ row: Row }>()

const headers = ref<{ label: string, key: string }[]>([
  { label: 'Special abilities', key: 'special_abilities' },
  { label: 'Legendary actions', key: 'legendary_actions' },
  { label: 'Actions', key: 'actions' },
  { label: 'Reactions', key: 'reactions' },
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
    <div class="space-y-4">
      <template
        v-for="item in headers"
        :key="item.key"
      >
        <div
          v-if="
            Array.isArray(row[item.key as keyof Row])
              && (row[item.key as keyof Row] as Action[])?.length
          "
          class="space-y-2"
        >
          <p class="head-2">
            {{ item.label }}
          </p>
          <div class="border-4 rounded-lg px-4 py-2 border-black bg-black/20">
            <ul
              v-for="action in (row[item.key as keyof Row] as Action[])"
              :key="action.name"
              class="flex w-full flex-col border-b-2 border-black last:border-b-0 py-1 list-disc"
            >
              <li class="flex flex-wrap gap-x-4 items-center">
                <p class="font-bold">
                  {{ action.name }}:
                </p>
                <p class="body-small">
                  {{ action.desc }}
                </p>
              </li>
              <div
                v-if="action.attack_bonus || action.damage_dice"
                class="flex flex-wrap gap-x-4 items-center mt-2"
              >
                <div
                  v-if="action.attack_bonus"
                  class="flex flex-wrap gap-x-2 items-center"
                >
                  <p class="font-bold">
                    To hit:
                  </p>
                  <p class="body-small">
                    +{{ action.attack_bonus }}
                  </p>
                </div>
                <div
                  v-if="action.damage_dice"
                  class="flex flex-wrap gap-x-2 items-center"
                >
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
            </ul>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>
