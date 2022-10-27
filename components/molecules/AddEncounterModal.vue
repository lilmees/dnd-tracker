<script setup>
import { contrastColor } from '@/util/contrastColor'
import { randomColor } from '@/util/randomColor'
import { useToastStore } from '@/store/toast'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['close', 'new'])
defineProps({ open: { type: Boolean, required: true } })

const toast = useToastStore()
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const { t } = useI18n({ useScope: 'global' })
const form = reactive({ title: null, group: null, background: '#0073A1' })
const isLoading = ref(false)
const error = ref()

function changeColor() {
  form.background = randomColor()
}

async function addEncounter(data) {
  const { __init, ...formData } = data
  const encounter = {
    ...formData,
    round: 1,
    rows: [],
    created_by: user.value.id,
    owners: [user.value.id],
    color: contrastColor(formData.background),
  }

  try {
    isLoading.value = true
    const { data, error } = await supabase.from('initiative_sheets').insert([encounter])
    if (error) throw error
    emit('new', data[0])
  } catch (err) {
    error.value = err.message
    toast.error({
      title: t('error.general.title'),
      text: t('error.general.text'),
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Modal v-if="open" @close="$emit('close')">
    <h2>{{ $t('encounters.title') }}</h2>
    <p v-if="error" class="text-danger text-center">{{ error }}</p>
    <FormKit v-model="form" type="form" :actions="false" message-class="error-message" @submit="addEncounter">
      <Input name="title" :label="$t('inputs.titleLabel')" validation="required|length:3,30" required />
      <Input name="group" :label="$t('inputs.groupLabel')" validation="length:3,15" />
      <div class="flex gap-2 items-end">
        <ColorPicker name="background" :label="$t('inputs.backgroundLabel')" validation="required" required />
        <div class="mb-[14px]">
          <Button :label="$t('encounters.random')" bold @click="changeColor" />
        </div>
      </div>
      <Button type="submit" :label="$t('encounters.add')" :loading="isLoading" inline bold />
    </FormKit>
  </Modal>
</template>
