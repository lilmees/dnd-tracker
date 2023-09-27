<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    user: SocialProfile
    username?: boolean
  }>(), {
    username: false
  }
)

const { locale } = useI18n()

const date = computed<string>(() => {
  if (!props.user.created_at) {
    return ''
  }

  const dateString = new Date(props.user.created_at)
  return dateString.toLocaleDateString(locale.value === 'nl' ? 'nl-NL' : 'en-US')
})
</script>

<template>
  <div v-if="user" class="w-fit">
    <tippy interactive trigger="mouseenter click">
      <div class="flex items-end gap-2 w-fit">
        <div
          class="w-10 h-10 bg-secondary/50 rounded-lg border-4 border-secondary overflow-hidden"
        >
          <NuxtImg
            :src="user.avatar"
            alt="avatar"
            sizes="sm:150px md:150px lg:150px"
            class="w-full h-full object-cover"
          />
        </div>
        <span class="font-bold">
          {{ user.username }}
        </span>
      </div>
      <template #content>
        <div class="p-4 overflow-auto space-y-2">
          <p class="head-3">
            {{ user.username }}
          </p>
          <div class="text-[10px] bg-background w-fit px-2 py-1 rounded-lg">
            {{ date }}
          </div>
          <div
            v-if="user.badges"
            class="flex flex-wrap items-end gap-4 border-t pt-2 border-slate-700"
          >
            <Badge
              v-for="badge in user.badges"
              :key="badge.label.nl"
              v-bind="badge"
            />
          </div>
        </div>
      </template>
    </tippy>
  </div>
</template>
