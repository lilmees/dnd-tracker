<script setup>
import { calculatePagination } from '@/util/calculatePagination'
import { useMonstersStore } from '@/store/monsters'
import { useToastStore } from '@/store/toast'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['hits'])
const props = defineProps({
  index: { type: String, required: true },
  placeholder: { type: String, required: true },
  label: { type: String, required: true },
  disabled: { type: Boolean, default: false },
})

const { t } = useI18n({ useScope: 'global' })
const toast = useToastStore()
const store = useMonstersStore()

const query = ref('')
const page = ref(0)
const pages = ref(0)

watchDebounced(
  query,
  async v => {
    if (v) {
      page.value = 0
      fetchMonsters(v, page.value)
    } else emit('hits', [])
  },
  { debounce: 500, maxWait: 1000 }
)

async function fetchMonsters(query, page) {
  try {
    const { from, to } = calculatePagination(page, 20)
    const { data, count } = await store.fuzzySearchMonsters(query, from, to)
    pages.value = Math.ceil(count / 20)
    emit('hits', data)
  } catch (err) {
    toast.error({ title: t('error.general.title'), text: t('error.general.text') })
  }
}

async function paginate(newPage) {
  page.value = newPage
  fetchMonsters(query.value, newPage)
}
</script>

<template>
  <div>
    <FormKit
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
    <Pagination v-if="pages > 1" v-model="page" :totalPages="pages" @paginate="paginate" />
  </div>
</template>
