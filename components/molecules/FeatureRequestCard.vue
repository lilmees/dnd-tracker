<script setup lang="ts">
const emit = defineEmits(['update', 'login'])
const props = defineProps<{ feature: FeatureRequest }>()

const { locale } = useI18n()
const profile = useProfileStore()

const date = computed<string>(() => {
  const dateString = new Date(props.feature.created_at)
  return dateString.toLocaleDateString(locale.value === 'nl' ? 'nl-NL' : 'en-US')
})

const hasVoted = computed<FeatureRequestVote|undefined>(() => {
  if (!profile.data) {
    return undefined
  }

  if (props.feature.voted.like.includes(profile.data.id)) {
    return 'like'
  } else if (props.feature.voted.dislike.includes(profile.data.id)) {
    return 'dislike'
  } else {
    return undefined
  }
})

function toggleVote (vote: FeatureRequestVote): void {
  if (!profile.data) {
    return
  }

  hasVoted.value === vote
    ? props.feature.voted[vote] = props.feature.voted[vote].filter(id => id !== profile.data!.id)
    : props.feature.voted[vote].push(profile.data.id)

  const reset: FeatureRequestVote = vote === 'like' ? 'dislike' : 'like'
  props.feature.voted[reset] = props.feature.voted[reset].filter(id => id !== profile.data!.id)

  emit('update', props.feature.voted)
}
</script>

<template>
  <article class="flex flex-col gap-4 rounded-lg border-4 border-black p-4 bg-black/30">
    <div class="flex gap-x-4 flex-1">
      <div class="flex flex-col gap-y-1">
        <ClientOnly>
          <button
            class="bg-black/50 border-4 border-black rounded-lg py-1 px-2 flex flex-col items-center"
            :class="{
              '!bg-primary/50 !border-primary': hasVoted === 'like'
            }"
            @click="profile.data ? toggleVote('like') : emit('login')"
          >
            <Icon
              name="ph:arrow-up"
              aria-hidden="true"
            />
            <span class="font-bold">
              {{ feature.voted.like.length }}
            </span>
          </button>
          <button
            class="bg-black/50 border-4 border-black rounded-lg py-1 px-2 flex flex-col items-center"
            :class="{
              '!bg-primary/50 !border-primary': hasVoted === 'dislike'
            }"
            @click="profile.data ? toggleVote('like') : emit('login')"
          >
            <span class="font-bold">
              {{ feature.voted.dislike.length }}
            </span>
            <Icon
              name="ph:arrow-down"
              aria-hidden="true"
            />
          </button>
        </ClientOnly>
      </div>

      <div class="flex flex-col flex-1 items-start justify-between gap-y-3">
        <div class="space-y-2">
          <Avatar :user="feature.created_by" username />
          <h2 class="py-2">
            {{ feature.title }}
            <span class="body-extra-small ml-2 bg-black/50 rounded-lg px-2 py-1">
              {{ date }}
            </span>
          </h2>
          <p
            v-if="feature.status !== 'accepted'"
            class="body-small"
            :class="{
              'text-info': feature.status === 'review',
              'text-success': feature.status === 'progress'
            }"
          >
            {{ $t(`pages.featureRequest.status.${feature.status}`) }}
          </p>
          <p class="body-small">
            {{ feature.text }}
          </p>
        </div>
      </div>
    </div>
  </article>
</template>
