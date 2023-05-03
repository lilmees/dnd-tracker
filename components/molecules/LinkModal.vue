<script setup lang="ts">
import { useTableStore } from '@/store/table'

const emit = defineEmits(['update'])
withDefaults(
  defineProps<{ url: null | string }>(), {
    url: null
  }
)

const store = useTableStore()

const isOpen: Ref<boolean> = ref(false)
const isUpdating: Ref<boolean> = ref(false)
const form: Ref<{ link: string }> = ref({ link: '' })

function updateLink ({ __init, link }: Obj): void {
  emit('update', link)
  isOpen.value = false
  isUpdating.value = false
}
</script>

<template>
  <div>
    <Icon
      name="ph:link-simple-horizontal"
      class="w-6 h-6 cursor-pointer text-info"
      @click="isOpen = true"
    />
    <Modal v-if="isOpen" @close="isOpen = false">
      <div v-if="store.isSandbox">
        <h3>{{ $t('home.demo') }}</h3>
      </div>
      <div v-else-if="!isUpdating">
        <h2 class="mb-10">
          {{ $t('encounter.link') }}
        </h2>
        <div v-if="url" class="flex gap-2 flex-wrap">
          <NuxtLink :to="url" target="_blank" rel="noreferrer noopener" class="grow">
            <Button :label="$t('actions.link')" inline />
          </NuxtLink>
          <div class="grow" @click="isUpdating = true">
            <Button :label="$t('actions.update')" inline />
          </div>
        </div>
        <Button v-else :label="$t('actions.add')" inline @click="isUpdating = true" />
      </div>
      <div v-else>
        <h2 class="mb-10">
          {{ $t('encounter.update.link') }}
        </h2>
        <FormKit
          v-model="form"
          type="form"
          :actions="false"
          message-class="error-message"
          @submit="updateLink"
        >
          <Input
            focus
            name="link"
            :label="$t('inputs.linkLabel')"
            validation="required|length10,200|url"
            required
          />
          <Button
            type="submit"
            :label="url ? $t('actions.update') : $t('actions.add')"
            inline
          />
        </FormKit>
      </div>
    </Modal>
  </div>
</template>
