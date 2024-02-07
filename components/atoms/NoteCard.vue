<script setup lang="ts">
defineEmits(['remove', 'update'])
const props = defineProps<{ note: Note, campaign: Campaign }>()

const profile = useProfileStore()

const description = ref<HTMLParagraphElement>()
const isLong = ref<boolean>(false)
const showAll = ref<boolean>(false)

onMounted(() => {
  if (description.value) {
    isLong.value = calculateLines(description.value, props.note.text) > 2
  }
})
</script>

<template>
  <section
    class="rounded-lg w-full bg-tracker/50 border-4 border-tracker relative group min-w-[250px] max-w-prose"
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
      <p
        ref="description"
        class="pt-2 transition-all"
        :class="{ 'line-clamp-2': !showAll }"
      >
        {{ note.text }}
      </p>
      <div v-if="isLong" class="flex justify-end mt-4">
        <button
          class="flex gap-2 btn-black"
          :aria-label="$t(`actions.read.${showAll ? 'less' : 'more'}`)"
          @click="showAll = !showAll"
        >
          <p>
            {{ $t(`actions.read.${showAll ? 'less' : 'more'}`) }}
          </p>
          <Icon
            name="tabler:chevron-down"
            class="duration-200 h-6 w-6 stroke-2"
            :class="{ 'rotate-180': showAll }"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  </section>
</template>
