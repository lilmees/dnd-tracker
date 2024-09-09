<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    user: SocialProfile
    username?: boolean
    name?: boolean
    interactive?: boolean
  }>(), {
    username: false,
    name: false,
    interactive: true,
  },
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
  <div
    v-if="user"
    class="w-fit"
  >
    <tippy
      interactive
      :delay="0"
      :trigger="interactive ? 'mouseenter click' : ''"
    >
      <div class="flex items-end gap-2 w-fit">
        <div
          class="w-10 h-10 bg-secondary/50 rounded-lg border-4 border-secondary overflow-hidden"
        >
          <img
            :src="user.avatar"
            alt="Avatar"
            class="w-full h-full object-cover"
          >
        </div>
        <div
          v-if="username || name"
          class="flex flex-col items-start"
        >
          <span
            v-if="username"
            class="font-bold"
          >
            {{ user.username }}
          </span>
          <span
            v-if="name"
            class="body-small"
          >
            {{ user.name }}
          </span>
        </div>
      </div>
      <template #content>
        <div class="p-4 overflow-auto space-y-2">
          <p class="head-3">
            {{ user.username }}
          </p>
          <div class="text-[12px] bg-background w-fit px-2 py-1 rounded-lg">
            {{ date }}
          </div>
          <div
            v-if="user.badges.length"
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
