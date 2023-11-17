<script setup lang="ts">
defineProps<{ sections: string[] }>()

const open = ref<number | null>(null)

function start (el: Element): void {
  (el as HTMLDivElement).style.height = el.scrollHeight + 'px'
}

function end (el: Element): void {
  (el as HTMLDivElement).style.height = ''
}
</script>

<template>
  <div
    v-for="(section, index) in sections"
    :key="section"
    class="rounded-lg p-4 bg-tracker/50 space-y-4 border-4 border-tracker mb-1"
  >
    <button
      class="flex w-full justify-between items-center outline-none"
      @click="open = open === index ? null : index"
      @keydown.escape="open = null"
    >
      <p class="head-2 ">
        {{ section }}
      </p>
      <Icon
        name="tabler:chevron-down"
        class="duration-200 h-6 w-6 stroke-2"
        :class="{ 'rotate-180': open === index }"
        aria-hidden="true"
      />
    </button>
    <Transition name="expand" @enter="start" @after-enter="end" @before-leave="start" @after-leave="end">
      <template v-if="open === index">
        <slot :name="section" />
      </template>
    </Transition>
  </div>
</template>

<style scoped>
.expand-leave-active,
.expand-enter-active {
  @apply duration-200 ease-in-out overflow-hidden;
}

.expand-leave-to,
.expand-enter-from {
  @apply !h-0 opacity-0;
}
</style>
