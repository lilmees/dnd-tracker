<script setup lang="ts">
defineEmits(['paginate'])

withDefaults(
  defineProps<{
    headers: TableHeader[]
    pages?: number
    shadow?: boolean
    searching?: boolean
    empty?: boolean
  }>(), {
    pages: 0,
    shadow: false,
    searching: false,
    empty: false
  }
)

const sortedBy = defineModel<string>('sortedBy')
const sortACS = defineModel<boolean>('acs', { default: false })
const page = defineModel<number>('page', { default: 0 })

const slots = useSlots()
</script>

<template>
  <section class="inline-block overflow-x-auto overflow-y-hidden w-full">
    <div class="bg-tracker/50 border-4 border-tracker rounded-lg relative overflow-y-hidden">
      <table class="min-w-full">
        <thead>
          <tr>
            <th
              v-for="{ label, sort, id } in headers"
              :key="label"
              class="py-3 px-2 border-b border-r last:border-r-0 border-slate-700"
              :class="{
                'cursor-pointer': sort,
                '!cursor-progress': searching
              }"
              @click="() => {
                if (sort && !searching) {
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

          <tr v-if="slots?.empty" class="py-20">
            <td
              :colspan="headers.length"
              class="py-20 px-5 font-bold"
            >
              <div class="max-w-prose mx-auto text-center">
                <slot name="empty" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="shadow" class="inset-0 z-[-1] fancy-shadow" />
    </div>
    <Pagination
      v-if="pages > 1"
      v-model="page"
      :total-pages="pages"
      :searching="searching"
      @paginate="$emit('paginate', $event)"
    />
  </section>
</template>
