<script setup>
import { useToastStore } from '@/store/toast'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['hits'])
const props = defineProps({
  index: { type: String, required: true },
  placeholder: { type: String, required: true },
  label: { type: String, required: true },
})

const { t } = useI18n({ useScope: 'global' })
const toast = useToastStore()
const { result, search } = useAlgoliaSearch(props.index)

const query = ref('')

watchDebounced(
  query,
  async v => {
    if (v) {
      try {
        await search({ query: query.value })
      } catch (err) {
        toast.error({ title: t('error.general.title'), text: t('error.general.text') })
      }
    } else emit('hits', [])
  },
  { debounce: 500, maxWait: 1000 }
)

// emit new values when they are fetched
watch(
  () => result.value,
  v => emit('hits', v.hits)
)

async function paginate(page) {
  try {
    await search({ query: query.value, requestOptions: { page } })
  } catch (err) {
    toast.error({ title: t('error.general.title'), text: t('error.general.text') })
  }
}
</script>

<template>
  <div>
    <FormKit
      v-model="query"
      type="text"
      :placeholder="placeholder"
      :label="label"
      label-class="font-bold body-small"
      inner-class="border-2 border-slate-400 rounded overflow-hidden focus-within:border-white"
      input-class="w-full h-8 px-3 border-none rounded text-white body-small placeholder-slate-400 bg-transparent"
      outer-class="mb-3"
    />
    <slot />
    <Pagination
      v-if="result && result.nbPages > 1"
      v-model="result.page"
      :totalPages="result.nbPages"
      @paginate="paginate"
    />
  </div>
</template>
