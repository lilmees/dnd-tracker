<script setup lang="ts">
import { reset } from '@formkit/core'

const emit = defineEmits(['update', 'close'])

const store = useTableStore()

const isUpdating = ref<boolean>(false)

const formatUrl = computed<string>(() => {
  if (store.activeRow?.link &&
  store.activeRow.link.includes('youtube') &&
  store.activeRow.link.includes('watch?v=')
  ) {
    const split: string[] = store.activeRow.link.split('watch?v=')
    return `${split[0]}embed/${split[1]}`
  } else {
    return store.activeRow?.link || ''
  }
})

function updateLink ({ __init, link }: Obj): void {
  emit('update', link)
  reset('form')
  isUpdating.value = false
}
</script>

<template>
  <Modal
    :big="store.activeRow?.link && !isUpdating ? true : false"
    @close="$emit('close')"
  >
    <div v-if="!isUpdating">
      <h2 class="mb-10">
        {{ $t('general.link') }}
      </h2>
      <template v-if="store.activeRow?.link">
        <div class="relative aspect-[9/12] sm:aspect-video overflow-hidden w-full mb-6">
          <iframe
            :src="formatUrl"
            class="absolute inset-0 w-full h-full border-none"
          />
        </div>
        <div class="flex gap-3 flex-wrap justify-end">
          <NuxtLink
            :to="store.activeRow.link"
            target="_blank"
            rel="noreferrer noopener"
            class=""
          >
            <button
              class="btn-primary"
              :aria-label="$t('actions.link')"
            >
              {{ $t('actions.link') }}
            </button>
          </NuxtLink>
          <button
            class="btn-black"
            :aria-label="$t('actions.update')"
            @click="isUpdating = true"
          >
            {{ $t('actions.update') }}
          </button>
        </div>
      </template>
      <div v-else class="space-y-3">
        <p class="max-w-prose">
          {{ $t('components.linkModal.placeholder') }}
        </p>
        <div class="flex justify-end">
          <button
            class="btn-primary"
            :aria-label="$t('actions.add')"
            @click="isUpdating = true"
          >
            {{ $t('actions.add') }}
          </button>
        </div>
      </div>
    </div>
    <div v-else>
      <h2 class="mb-10">
        {{ $t('pages.encounter.update.link') }}
      </h2>
      <FormKit
        id="form"
        type="form"
        :actions="false"
        @submit="updateLink"
      >
        <FormKit
          name="link"
          :label="$t('components.inputs.linkLabel')"
          validation="required|length10,200|url"
        />
        <FormKit
          type="submit"
          class="btn-black"
          :aria-label="store.activeRow?.link ? $t('actions.update') : $t('actions.add')"
        >
          {{ store.activeRow?.link ? $t('actions.update') : $t('actions.add') }}
        </FormKit>
      </FormKit>
    </div>
  </Modal>
</template>
