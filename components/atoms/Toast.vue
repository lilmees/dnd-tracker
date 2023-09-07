<script setup lang="ts">
const emit = defineEmits(['remove'])
const props = defineProps<{ toast: Toast }>()

const { pause, resume } = useTimeoutPoll(() => {
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
    class="w-full mb-2 pointer-events-auto rounded-lg border-4 cursor-pointer overflow-auto backdrop-blur"
    :class="{
      'border-danger bg-danger/50': toast.type === 'error',
      'border-warning bg-warning/50': toast.type === 'warn',
      'border-success bg-success/50': toast.type === 'success',
      'border-info bg-info/50': toast.type === 'info',
    }"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    <div class="flex p-2 items-start gap-2 text-white">
      <Icon
        v-if="toast.type === 'info'"
        name="material-symbols:info-outline-rounded"
        class="min-w-[25px] min-h-[25px] text-info"
        aria-hidden="true"
      />
      <Icon
        v-if="toast.type === 'warn'"
        name="material-symbols:warning-outline-rounded"
        class="min-w-[25px] min-h-[25px] text-warning"
        aria-hidden="true"
      />
      <Icon
        v-if="toast.type === 'success'"
        name="material-symbols:check-small-rounded"
        class="min-w-[25px] min-h-[25px] text-success"
        aria-hidden="true"
      />
      <Icon
        v-if="toast.type === 'error'"
        name="material-symbols:error-outline-rounded"
        class="min-w-[25px] min-h-[25px] text-danger"
        aria-hidden="true"
      />
      <div class="grow">
        <p v-if="toast.title" class="pb-2 font-bold">
          {{ toast.title }}
        </p>
        <p v-if="toast.text" class="body-small">
          {{ toast.text }}
        </p>
      </div>
      <Icon
        name="ic:round-clear"
        class="min-w-[25px] min-h-[25px] self-start text-danger cursor-pointer"
        aria-hidden="true"
        :aria-label="$t('actions.remove')"
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
