<script setup lang="ts">
const emit = defineEmits(['update'])
withDefaults(
  defineProps<{ url?: null | string }>(), {
    url: null
  }
)

const store = useTableStore()

const isOpen = ref<boolean>(false)
const isUpdating = ref<boolean>(false)
const form = ref<{ link: string }>({ link: '' })

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
        <h3>{{ $t('components.linkModal.demo') }}</h3>
      </div>
      <div v-else-if="!isUpdating">
        <h2 class="mb-10">
          {{ $t('general.link') }}
        </h2>
        <div v-if="url" class="flex gap-2 flex-wrap">
          <NuxtLink :to="url" target="_blank" rel="noreferrer noopener" class="grow">
            <button
              class="btn-black w-full"
              :aria-label="$t('actions.link')"
            >
              {{ $t('actions.link') }}
            </button>
          </NuxtLink>
          <button
            class="btn-black grow"
            :aria-label="$t('actions.update')"
            @click="isUpdating = true"
          >
            {{ $t('actions.update') }}
          </button>
        </div>
        <button
          v-else
          class="btn-black w-full"
          :aria-label="$t('actions.add')"
          @click="isUpdating = true"
        >
          {{ $t('actions.add') }}
        </button>
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
          <Input
            focus
            name="link"
            :label="$t('components.inputs.linkLabel')"
            validation="required|length10,200|url"
            required
          />
          <button
            type="submit"
            class="btn-black w-full mt-3"
            :aria-label="url ? $t('actions.update') : $t('actions.add')"
          >
            {{ url ? $t('actions.update') : $t('actions.add') }}
          </button>
        </FormKit>
      </div>
    </Modal>
  </div>
</template>
