<script setup lang="ts">
const emit = defineEmits(['update'])
const props = withDefaults(
  defineProps<{ name: string, type?: string}>(), {
    type: 'player'
  }
)

const isOpen = ref<boolean>(false)
const form = ref<{ name: string }>({ name: '' })

function updateName ({ __init, name }: Obj): void {
  emit('update', name.trim())
  isOpen.value = false
}
</script>

<template>
  <div>
    <div class="flex gap-2 items-center pl-4">
      <Icon
        :name="useHomebrewIcon(type)"
        :class="useHomebrewColor(type)"
        size="20"
      />
      <p
        class="peer cursor-pointer"
        @click="isOpen = true"
      >
        {{ name }}
      </p>
      <Icon
        name="lucide:wrench"
        class="w-4 h-4 opacity-0 peer-hover:opacity-100 duration-200 ease-in-out"
      />
    </div>
    <Modal v-if="isOpen" @close="isOpen = false">
      <template #header>
        <h2>{{ $t('pages.encounter.update.name') }}</h2>
      </template>
      <FormKit
        v-model="form"
        type="form"
        :actions="false"
        @submit="updateName"
      >
        <FormKit
          name="name"
          :label="$t('components.inputs.nameLabel')"
          validation="required|length:3,30"
        />
        <FormKit type="submit" :aria-label="$t('actions.update')">
          {{ $t('actions.update') }}
        </FormKit>
      </FormKit>
    </Modal>
  </div>
</template>
