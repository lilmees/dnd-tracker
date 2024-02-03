<script setup lang="ts">
defineEmits(['remove', 'copy', 'update', 'share'])
withDefaults(
  defineProps<{
    encounter: Encounter
    disableCopy?: boolean
   }>(), {
    disableCopy: false
  }
)

const profile = useProfileStore()
</script>

<template>
  <div
    class="rounded-lg min-w-[250px] max-w-md relative border-4 flex flex-col"
    :style="{
      'background-color': `${encounter.background}80`,
      'border-color': encounter.background,
      color: encounter.color
    }"
  >
    <div class="flex justify-end mr-2">
      <tippy
        v-if="!encounter.campaign || (profile.data && isAdmin(encounter.campaign, profile.data.id))"
        interactive
        placement="bottom"
        :z-index="2"
      >
        <Icon
          name="tabler:dots"
          class="w-6 h-6 cursor-pointer"
          :style="{ color: encounter.color }"
          aria-hidden="true"
        />
        <template #content>
          <div class="p-4 space-y-2 overflow-auto">
            <button
              class="flex gap-2 items-center max-w-max"
              :aria-label="$t('actions.share')"
              @click="$emit('share', encounter)"
            >
              <Icon
                name="material-symbols:share"
                class="h-4 w-4"
                aria-hidden="true"
              />
              <p>{{ $t('actions.share') }}</p>
            </button>
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
              class="flex gap-2 items-center max-w-max disabled:opacity-50 disabled:cursor-not-allowed"
              :aria-label="$t('actions.copy')"
              :disabled="disableCopy"
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
      <Icon
        v-else
        v-tippy="$t('general.notAllowed')"
        name="tabler:dots"
        class="w-6 h-6 cursor-not-allowed opacity-50 absolute"
        aria-hidden="true"
      />
    </div>
    <RouteLink
      :url="encounterUrl(encounter)"
      class="flex flex-col gap-4 justify-between px-6 pb-8 pt-2 cursor-pointer grow !max-w-full"
      :class="{ 'pt-8': encounter.campaign && profile.data && !isAdmin(encounter.campaign, profile.data.id) }"
      :style="false"
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
