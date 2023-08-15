<script setup lang="ts">
import { encounterUrl } from '@/utils/url-genarators'

defineEmits(['remove', 'copy', 'update'])
defineProps<{ encounter: Encounter }>()

const user = useSupabaseUser()
const localePath = useLocalePath()
</script>

<template>
  <div
    class="rounded-lg min-w-[250px] max-w-md relative group border-4"
    :style="{
      'background-color': `${encounter.background}80`,
      'border-color': encounter.background,
      color: encounter.color
    }"
  >
    <div class="flex justify-end mr-2">
      <tippy
        v-if="user && encounter.created_by === user.id"
        interactive
        :z-index="2"
      >
        <Icon
          name="tabler:dots"
          class="w-6 h-6 cursor-pointer opacity-0 group-hover:opacity-100 duration-200 ease-in-out"
          :style="{ color: encounter.color }"
        />
        <template #content>
          <div class="p-4 space-y-2 overflow-auto">
            <button
              class="flex gap-2 items-center max-w-max"
              @click="$emit('update', encounter)"
            >
              <Icon name="lucide:wrench" class="h-4 w-4" />
              <p>{{ $t('actions.update') }}</p>
            </button>
            <button
              class="flex gap-2 items-center max-w-max"
              @click="$emit('copy', encounter)"
            >
              <Icon name="material-symbols:content-copy-outline-rounded" class="h-4 w-4" />
              <p>{{ $t('actions.copy') }}</p>
            </button>
            <button
              class="flex gap-2 items-center max-w-max"
              @click="$emit('remove', encounter)"
            >
              <Icon name="material-symbols:delete-outline-rounded" class="h-4 w-4" />
              <p>{{ $t('actions.delete') }}</p>
            </button>
          </div>
        </template>
      </tippy>
    </div>
    <NuxtLink
      :to="localePath(encounterUrl(encounter))"
      class="flex flex-col gap-2 justify-between px-6 pb-8 pt-2 cursor-pointer"
    >
      <h2>{{ encounter.title }}</h2>
      <div>
        <p>Rows: {{ encounter.rows.length }}</p>
      </div>
    </NuxtLink>
  </div>
</template>
