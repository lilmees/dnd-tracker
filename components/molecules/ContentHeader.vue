<script setup lang="ts">
withDefaults(
  defineProps<{
    toMuch: boolean
    hideToggle: boolean
   }>(), {
    toMuch: false,
    hideToggle: false
  }
)

const isTable = defineModel<boolean>('grid')
const search = defineModel<string>('search')

const router = useRouter()
const route = useRoute()

if (!isTable.value) {
  isTable.value = route.query.format === 'table'
}

watch(() => isTable.value, (v) => {
  router.push({ query: { format: v ? 'table' : undefined } })
}, { immediate: true })
</script>

<template>
  <div class="flex justify-between mb-8 items-center gap-8">
    <FormKit
      v-model="search"
      type="search"
      suffix-icon="search"
      outer-class="$reset !pb-0 w-fit tracker-shadow"
    />
    <div class="flex gap-x-4 gap-y-2 items-center flex-wrap">
      <slot />
      <div
        v-if="!hideToggle"
        v-tippy="{
          content: toMuch ? $t('components.contentHeader.toMuch') : undefined
        }"
        class="flex items-center gap-1"
      >
        <button
          v-tippy="{
            content: $t('general.cards'),
            delay: 500
          }"
          :aria-label="$t('general.cards')"
          :disabled="toMuch"
          class="disabled:opacity-50 disabled:cursor-not-allowed"
          @click="isTable = false"
        >
          <Icon
            name="clarity:view-cards-line"
            class="w-8 h-8 duration-200 ease-in-out transition-colors"
            :class="{ 'text-primary': !isTable }"
            aria-hidden="true"
          />
        </button>
        <span class="font-bold text-slate-300">
          |
        </span>
        <button
          v-tippy="{
            content: $t('general.table'),
            delay: 500
          }"
          :aria-label="$t('general.table')"
          :disabled="toMuch"
          class="disabled:opacity-50 disabled:cursor-not-allowed"
          @click="isTable = true"
        >
          <Icon
            name="lets-icons:table"
            class="w-8 h-8 duration-200 ease-in-out transition-colors"
            :class="{ 'text-primary': isTable }"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  </div>
</template>
