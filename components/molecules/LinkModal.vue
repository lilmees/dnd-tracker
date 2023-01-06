<script setup>
import Link from '@/assets/icons/link.svg'

const emit = defineEmits(['update'])
const props = defineProps({
  link: { type: [null, String], required: true },
  showcase: { type: Boolean, default: false },
})

const isOpen = ref(false)
const isUpdating = ref(false)
const form = ref({ link: null })

function updateLink({ __init, link }) {
  emit('update', link)
  isOpen.value = false
  isUpdating.value = false
}
</script>

<template>
  <div>
    <Link class="w-6 h-6 cursor-pointer text-info" @click="isOpen = true" />
    <Modal v-if="isOpen" @close="isOpen = false">
      <div v-if="showcase">
        <h3>{{ $t('home.demo') }}</h3>
      </div>
      <div v-else-if="!isUpdating">
        <h2 class="mb-10">{{ $t('encounter.link') }}</h2>
        <div v-if="link" class="flex gap-2 flex-wrap">
          <NuxtLink :to="link" target="_blank" rel="noreferrer noopener" class="grow">
            <Button :label="$t('actions.link')" inline />
          </NuxtLink>
          <div class="grow" @click="isUpdating = true">
            <Button :label="$t('actions.update')" inline />
          </div>
        </div>
        <Button v-else :label="$t('actions.add')" inline @click="isUpdating = true" />
      </div>
      <div v-else>
        <h2 class="mb-10">{{ $t('encounter.update.link') }}</h2>
        <FormKit v-model="form" type="form" :actions="false" message-class="error-message" @submit="updateLink">
          <Input name="link" :label="$t('inputs.linkLabel')" validation="required|length10,200|url" required />
          <Button type="submit" :label="link ? $t('actions.update') : $t('actions.add')" inline />
        </FormKit>
      </div>
    </Modal>
  </div>
</template>
