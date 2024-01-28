<script setup lang="ts">
const isTabel = defineModel<boolean>('grid')
const search = defineModel<string>('search')

const router = useRouter()
const route = useRoute()

onMounted(() => {
  if (!isTabel.value) {
    isTabel.value = route.query.format === 'table'
  }
})

watch(() => isTabel.value, (v) => {
  isTabel.value = v
  router.push({ query: { format: v ? 'table' : undefined } })
}, { immediate: true })
</script>

<template>
  <div class="flex justify-between pb-8 items-center gap-8">
    <FormKit
      v-model="search"
      type="search"
      suffix-icon="search"
      outer-class="$reset !pb-0 w-fit"
    />
    <div class="flex gap-x-4 gap-y-2 items-center flex-wrap">
      <slot />
      <div class="flex items-center gap-1">
        <button
          v-tippy="{
            content: $t('general.cards'),
            delay: 500
          }"
          :aria-label="$t('general.cards')"
          @click="isTabel = false"
        >
          <Icon
            name="clarity:view-cards-line"
            class="w-8 h-8 duration-200 ease-in-out transition-colors"
            :class="{ 'text-primary': !isTabel }"
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
          @click="isTabel = true"
        >
          <Icon
            name="lets-icons:table"
            class="w-8 h-8 duration-200 ease-in-out transition-colors"
            :class="{ 'text-primary': isTabel }"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  </div>
</template>
