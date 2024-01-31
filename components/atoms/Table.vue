<script setup lang="ts">
defineEmits(['paginate'])

withDefaults(
  defineProps<{
    headers: TableHeader[]
    pages?: number
  }>(), {
    pages: 0
  }
)

const sortedBy = defineModel<string>('sortedBy')
const sortACS = defineModel<boolean>('acs', { default: false })
const page = defineModel<number>('page', { default: 0 })
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
                  class="w-5 h-5 text-secondary/50 transition-all"
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
        <tbody v-auto-animate>
          <slot />
        </tbody>
      </table>
      <slot name="empty" />
    </div>
    <Pagination
      v-if="pages > 1"
      v-model="page"
      :total-pages="pages"
      @paginate="$emit('paginate', $event)"
    />
  </section>
</template>
