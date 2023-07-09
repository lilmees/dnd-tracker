<script setup lang="ts">
import { _padding } from '#tailwind-config/theme'

const emit = defineEmits(['remove'])
const props = defineProps<{ toast: Toast }>()

const { isActive, pause, resume } = useTimeoutPoll(() => {
  loading.value -= 1

  if (!loading.value) {
    pause()
    emit('remove', props.toast.key)
  } else if (loader.value) {
    loader.value.style.width = `${loading.value}%`
  }
}, props.toast.timeout / 100)

const loader = ref<HTMLDivElement>()
const isHover = ref<boolean>(false)
const loading = ref<number>(100)

onMounted(() => {
  if (props.toast.timed) {
    resume()
  }
})

watch(() => isHover.value, (v: boolean) => {
  if (props.toast.timed) {
    v ? pause() : resume()
  }
})
</script>

<template>
  <div
    class="w-full mb-2 tracker-shadow pointer-events-auto rounded-lg bg-background border-2 cursor-pointer"
    :class="{
      'border-danger': toast.type === 'error',
      'border-warning': toast.type === 'warn',
      'border-success': toast.type === 'success',
      'border-info': toast.type === 'info',
    }"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    <div class="flex p-2 items-start gap-2 text-white">
      <Icon
        v-if="toast.type === 'info'"
        name="material-symbols:info-outline-rounded"
        class="icon text-info"
      />
      <Icon
        v-if="toast.type === 'warn'"
        name="material-symbols:warning-outline-rounded"
        class="icon text-warning"
      />
      <Icon
        v-if="toast.type === 'success'"
        name="material-symbols:check-small-rounded"
        class="icon text-success"
      />
      <Icon
        v-if="toast.type === 'error'"
        name="material-symbols:error-outline-rounded"
        class="icon text-danger"
      />
      <div class="grow">
        <h1 v-if="toast.title" class="pb-2">
          {{ toast.title }}
        </h1>
        <p v-if="toast.text">
          {{ toast.text }}
        </p>
      </div>
      <Icon
        name="ic:round-clear"
        class="icon self-start text-danger cursor-pointer"
        @click="$emit('remove', toast.key)"
      />
    </div>
    <div
      ref="loader"
      class="h-2 ease-linear duration-200"
      :class="{
        'bg-danger': toast.type === 'error',
        'bg-warning': toast.type === 'warn',
        'bg-success': toast.type === 'success',
        'bg-info': toast.type === 'info',
      }"
    />
  </div>
</template>

<style scoped>
.icon {
  @apply min-w-[35px] min-h-[35px];
}
</style>
