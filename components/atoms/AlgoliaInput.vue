<script setup>
import { useToastStore } from '@/store/toast'
import { useMonstersStore } from '@/store/monsters'
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
watchDebounced(
  query,
  async v => {
    if (v) {
      try {
        const results = await store.fuzzySearchMonsters(v)
        emit('hits', results)
      } catch (err) {
        toast.error({ title: t('error.general.title'), text: t('error.general.text') })
      }
    } else emit('hits', [])
  },
  { debounce: 500, maxWait: 1000 }
)
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
  </div>
</template>
