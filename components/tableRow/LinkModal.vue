<script setup lang="ts">
const emit = defineEmits(['update'])
const props = withDefaults(
  defineProps<{ url?: null | string }>(), {
    url: null
  }
)

const isOpen = ref<boolean>(false)
const isUpdating = ref<boolean>(false)
const form = ref<{ link: string }>({ link: '' })

const formatUrl = computed<string>(() => {
  if (props.url && props.url.includes('youtube') && props.url.includes('watch?v=')) {
    const split: string[] = props.url.split('watch?v=')
    return `${split[0]}embed/${split[1]}`
  } else {
    return props.url || ''
  }
})

function updateLink ({ __init, link }: Obj): void {
  emit('update', link)
  isOpen.value = false
  isUpdating.value = false
}
</script>

<template>
  <div>
    <button
      :aria-label="$t('actions.open')"
      @click="isOpen = true"
    >
      <Icon
        name="ph:link-simple-horizontal"
        class="w-6 h-6 text-info"
        aria-hidden="true"
      />
    </button>
    <Modal
      v-if="isOpen"
      :big="url && !isUpdating ? true : false"
      @close="isOpen = false"
    >
      <div v-if="!isUpdating">
        <h2 class="mb-10">
          {{ $t('general.link') }}
        </h2>
        <template v-if="url">
          <div class="relative aspect-[9/12] sm:aspect-video overflow-hidden w-full mb-6">
            <iframe
              :src="formatUrl"
              class="absolute inset-0 w-full h-full border-none"
            />
          </div>
          <div class="flex gap-3 flex-wrap justify-end">
            <NuxtLink
              :to="url"
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
          v-model="form"
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
            :aria-label="url ? $t('actions.update') : $t('actions.add')"
          >
            {{ url ? $t('actions.update') : $t('actions.add') }}
          </FormKit>
        </FormKit>
      </div>
    </Modal>
  </div>
</template>
