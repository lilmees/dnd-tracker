<script setup>
import { calculatePagination } from '@/util/calculatePagination'
import { useToastStore } from '@/store/toast'

const emit = defineEmits(['hits'])
const props = defineProps({
  index: { type: String, required: true },
  placeholder: { type: String, required: true },
  label: { type: String, required: true },
  disabled: { type: Boolean, default: false },
  focus: { type: Boolean, default: false }
})

const toast = useToastStore()

const query = ref('')
const page = ref(0)
const pages = ref(0)

onMounted(() => {
  if (props.focus) {
    document.querySelector('#el')?.focus()
  }
})

// watchDebounced(
//   query,
//   (v) => {
//     if (v) {
//       page.value = 0
//       fetchMonsters(v, page.value)
//     } else {
//       emit('hits', [])
//     }
//   },
//   { debounce: 500, maxWait: 1000 }
// )

// async function fetchMonsters (query, page) {
//   try {
//     const { from, to } = calculatePagination(page, 20)
// const { data, count } = await store.fuzzySearchMonsters(query, from, to)
// pages.value = Math.ceil(count / 20)
// emit('hits', data)
//   } catch (err) {
//     toast.error()
//   }
// }

function paginate (newPage) {
  page.value = newPage
  fetchMonsters(query.value, newPage)
  const el = document.getElementById('el')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }
}
</script>

<template>
  <div>
    <FormKit
      id="el"
      v-model="query"
      type="text"
      :placeholder="placeholder"
      :label="label"
      :disabled="disabled"
      label-class="font-bold body-small"
      inner-class="border-2 border-slate-400 rounded overflow-hidden focus-within:border-white"
      input-class="w-full h-8 px-3 border-none rounded text-white body-small placeholder-slate-400 bg-transparent"
      outer-class="mb-3"
    />
    <slot />
    <Pagination v-if="pages > 1" v-model="page" :total-pages="pages" @paginate="paginate" />
  </div>
</template>
