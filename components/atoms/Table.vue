<script setup lang="ts">
defineEmits(['paginate'])

const props = withDefaults(
  defineProps<{
    headers: { label: string, sort: boolean, id: string }[]
    pages?: number
    page?: number
    perPage?: number
  }>(), {
    acs: false,
    pages: 0,
    page: 0,
    perPage: 20
  }
)

const sortedBy = defineModel<string>('sortedBy')
const sortACS = defineModel<boolean>('acs')

const localPage = ref<number>(props.page)

watch(() => props.page, (newPage) => {
  localPage.value = newPage
})
</script>

<template>
  <section class="inline-block overflow-x-auto overflow-y-hidden w-full">
    <div class="bg-tracker/50 border-4 border-tracker rounded-lg">
      <table class="min-w-full">
        <thead>
          <tr>
            <th
              v-for="{ label, sort, id } in headers"
              :key="label"
              class="py-3 px-2 border-b border-r last:border-r-0 border-slate-700 cursor-pointer"
              @click="() => {
                if (sort) {
                  sortACS = id === sortedBy ? !sortACS : false
                  sortedBy = id
                }
              }"
            >
              <div class="flex gap-2 justify-center items-center">
                <span>
                  {{ label }}
                </span>
                <Icon
                  v-if="sort"
                  name="ph:arrows-down-up-bold"
                  class="w-5 h-5 text-secondary/50 transition-colors transition-transform"
                  :class="{
                    '!text-secondary': sortedBy === id,
                    'rotate-180': sortedBy === id && !sortACS
                  }"
                  aria-hidden="true"
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <slot />
        </tbody>
      </table>
      <slot name="empty" />
    </div>
    <Pagination
      v-if="pages > 1"
      v-model="localPage"
      :total-pages="pages"
      @paginate="$emit('paginate', $event)"
    />
  </section>
</template>
