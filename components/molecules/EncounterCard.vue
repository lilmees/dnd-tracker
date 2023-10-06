<script setup lang="ts">
import { encounterUrl } from '@/utils/url-genarators'
import { isAdmin } from '@/utils/permission-helpers'

defineEmits(['remove', 'copy', 'update'])
defineProps<{ encounter: Encounter }>()

const profile = useProfileStore()
</script>

<template>
  <div
    class="rounded-lg min-w-[250px] max-w-md relative group border-4 flex flex-col"
    :style="{
      'background-color': `${encounter.background}80`,
      'border-color': encounter.background,
      color: encounter.color
    }"
  >
    <div class="flex justify-end mr-2">
      <tippy
        v-if="profile.data && isAdmin(encounter.campaign as Campaign, profile.data.id)"
        interactive
        :z-index="2"
      >
        <Icon
          name="tabler:dots"
          class="w-6 h-6 cursor-pointer opacity-0 group-hover:opacity-100 duration-200 ease-in-out"
          :style="{ color: encounter.color }"
          aria-hidden="true"
        />
        <template #content>
          <div class="p-4 space-y-2 overflow-auto">
            <button
              class="flex gap-2 items-center max-w-max"
              :aria-label="$t('actions.update')"
              @click="$emit('update', encounter)"
            >
              <Icon
                name="lucide:wrench"
                class="h-4 w-4"
                aria-hidden="true"
              />
              <p>{{ $t('actions.update') }}</p>
            </button>
            <button
              class="flex gap-2 items-center max-w-max"
              :aria-label="$t('actions.copy')"
              @click="$emit('copy', encounter)"
            >
              <Icon
                name="material-symbols:content-copy-outline-rounded"
                class="h-4 w-4"
                aria-hidden="true"
              />
              <p>{{ $t('actions.copy') }}</p>
            </button>
            <button
              class="flex gap-2 items-center max-w-max"
              :aria-label="$t('actions.delete')"
              @click="$emit('remove', encounter)"
            >
              <Icon
                name="material-symbols:delete-outline-rounded"
                class="h-4 w-4"
                aria-hidden="true"
              />
              <p>{{ $t('actions.delete') }}</p>
            </button>
          </div>
        </template>
      </tippy>
    </div>
    <RouteLink
      :url="encounterUrl(encounter)"
      class="flex flex-col gap-2 justify-between px-6 pb-8 pt-2 cursor-pointer grow !max-w-full"
      :style="false"
      :class="{ 'pt-8': !isAdmin(encounter.campaign as Campaign, profile.data?.id || '') }"
    >
      <h2>
        {{ encounter.title }}
      </h2>
      <div>
        <p>Rows: {{ encounter.rows.length }}</p>
      </div>
    </RouteLink>
  </div>
</template>
