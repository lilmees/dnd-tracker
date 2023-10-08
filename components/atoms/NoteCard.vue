<script setup lang="ts">
import { isAdmin } from '@/utils/permission-helpers'

defineEmits(['remove', 'update'])
defineProps<{ note: Note, campaign: Campaign }>()

const profile = useProfileStore()
</script>

<template>
  <section
    class="rounded-lg w-fit bg-tracker/50 border-4 border-tracker relative group min-w-[250px] max-w-prose"
  >
    <div class="flex justify-end mr-2">
      <tippy interactive :z-index="2">
        <Icon
          v-if="isAdmin(campaign, profile.data?.id || '')"
          name="tabler:dots"
          class="w-6 h-6 cursor-pointer opacity-0 group-hover:opacity-100 duration-200 ease-in-out"
          aria-hidden="true"
        />
        <template #content>
          <div class="p-4 space-y-2 overflow-auto">
            <button
              class="flex gap-2 items-center max-w-max"
              :aria-label="$t('actions.update')"
              @click="$emit('update', note)"
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
              :aria-label="$t('actions.remove')"
              @click="$emit('remove', note)"
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
    <div
      class="flex flex-col gap-2 justify-between px-6 pb-8 pt-2"
      :class="{ 'pt-8': !isAdmin(campaign, profile.data?.id || '') }"
    >
      <h3 v-if="note.title">
        {{ note.title }}
      </h3>
      <p class="pt-2">
        {{ note.text }}
      </p>
    </div>
  </section>
</template>
