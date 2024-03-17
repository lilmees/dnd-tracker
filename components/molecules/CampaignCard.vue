<script setup lang="ts">
defineEmits(['remove', 'update'])
defineProps<{ campaign: Campaign }>()

const user = useSupabaseUser()
</script>

<template>
  <div
    class="rounded-lg min-w-[250px] max-w-md relative border-4 flex flex-col"
    :style="{
      'background-color': `${campaign.background}80`,
      'border-color': campaign.background,
      color: campaign.color
    }"
  >
    <div class="flex justify-end mr-2">
      <tippy
        v-if="user && isOwner(campaign, user.id)"
        interactive
        :z-index="2"
      >
        <Icon
          name="tabler:dots"
          class="w-6 h-6 cursor-pointer"
          :style="{ color: campaign.color }"
          aria-hidden="true"
        />
        <template #content>
          <div class="p-4 space-y-2 overflow-auto">
            <button
              class="flex gap-2 items-center max-w-max icon-btn-info"
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
              class="flex gap-2 items-center max-w-max icon-btn-danger"
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
      <Icon
        v-else
        v-tippy="$t('general.notAllowed')"
        name="tabler:dots"
        class="w-6 h-6 cursor-not-allowed opacity-50 absolute"
        :style="{ color: campaign.color }"
        aria-hidden="true"
      />
    </div>
    <RouteLink
      :url="campaignUrl(campaign, 'content')"
      class="flex flex-col gap-4 justify-between px-6 pb-8 pt-2 cursor-pointer grow !max-w-full"
      :style="false"
      :class="{ 'pt-8': !isOwner(campaign, user?.id || '') }"
    >
      <h2>{{ campaign.title }}</h2>
      <div class="flex gap-4">
        <div
          v-tippy="{content: $t('general.members')}"
          class="flex items-center gap-1"
        >
          <Icon name="fluent:people-team-16-filled" :aria-hidden="true" />
          <span class="body-small">
            {{ (campaign.team?.length || 0) + 1 }}
          </span>
        </div>
        <div
          v-tippy="{content: $t('general.encounters')}"
          class="flex items-center gap-1"
        >
          <Icon name="ri:table-fill" :aria-hidden="true" />
          <span class="body-small">
            {{ campaign.initiative_sheets?.length || 0 }}
          </span>
        </div>
        <div
          v-tippy="{content: $t('general.homebrew')}"
          class="flex items-center gap-1"
        >
          <Icon name="ph:beer-stein-fill" :aria-hidden="true" />
          <span class="body-small">
            {{ campaign.homebrew_items?.length || 0 }}
          </span>
        </div>
      </div>
    </RouteLink>
  </div>
</template>
