<script setup lang="ts">
import { campaignUrl } from '@/utils/url-genarators'

defineEmits(['remove', 'update'])
defineProps<{ campaign: Campaign }>()

const user = useSupabaseUser()
</script>

<template>
  <div
    class="rounded-lg min-w-[250px] max-w-md relative group border-4"
    :style="{
      'background-color': `${campaign.background}80`,
      'border-color': campaign.background,
      color: campaign.color
    }"
  >
    <div class="flex justify-end mr-2">
      <tippy
        v-if="user && campaign.created_by === user.id"
        interactive
        :z-index="2"
      >
        <Icon
          name="tabler:dots"
          class="w-6 h-6 cursor-pointer opacity-0 group-hover:opacity-100 duration-200 ease-in-out"
          :style="{ color: campaign.color }"
          aria-hidden="true"
        />
        <template #content>
          <div class="p-4 space-y-2 overflow-auto">
            <button
              class="flex gap-2 items-center max-w-max"
              :aria-label="$t('actions.update')"
              @click="$emit('update', campaign)"
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
              @click="$emit('remove', campaign)"
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
      :url="campaignUrl(campaign)"
      class="flex flex-col gap-2 justify-between px-6 pb-8 pt-2 cursor-pointer"
    >
      <h2>{{ campaign.title }}</h2>
      <div>
        <p>Encounters: {{ campaign.initiative_sheets?.length || 0 }}</p>
      </div>
    </RouteLink>
  </div>
</template>
