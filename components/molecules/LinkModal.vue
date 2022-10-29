<script setup>
import Link from '@/assets/icons/link.svg'

const emit = defineEmits(['update'])
const props = defineProps({ link: { type: [null, String], required: true } })

const isOpen = ref(false)
const isUpdating = ref(false)
const form = reactive({ link: null })

function updateLink(data) {
  const { __init, link } = data
  emit('update', link)
  isOpen.value = false
  isUpdating.value = false
}
</script>

<template>
  <div>
    <Link class="w-6 h-6 cursor-pointer text-info" @click="isOpen = true" />
    <Modal v-if="isOpen" @close="isOpen = false">
      <div v-if="!isUpdating">
        <h2 class="mb-3">{{ $t('encounter.link') }}</h2>
        <div v-if="link" class="flex gap-2 flex-wrap">
          <NuxtLink :to="link" target="_blank" rel="noreferrer noopener" class="grow">
            <Button :label="$t('actions.link')" bold inline />
          </NuxtLink>
          <div class="grow" @click="isUpdating = true">
            <Button :label="$t('actions.update')" bold inline />
          </div>
        </div>
        <Button v-else :label="$t('actions.add')" bold inline @click="isUpdating = true" />
      </div>
      <div v-else>
        <h2 class="mb-3">{{ $t('encounter.update.link') }}</h2>
        <FormKit v-model="form" type="form" :actions="false" message-class="error-message" @submit="updateLink">
          <Input name="link" :label="$t('inputs.linkLabel')" validation="required|length10,200|url" required />
          <Button type="submit" :label="link ? $t('actions.update') : $t('actions.add')" bold inline />
        </FormKit>
      </div>
    </Modal>
  </div>
</template>
