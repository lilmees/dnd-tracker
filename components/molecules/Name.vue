<script setup lang="ts">
const emit = defineEmits(['update'])
withDefaults(
  defineProps<{ name: string, type?: string}>(), {
    type: 'player'
  }
)

const isOpen: Ref<boolean> = ref(false)
const form: Ref<{ name: string }> = ref({ name: '' })

function updateName ({ __init, name }: Obj): void {
  emit('update', name.trim())
  isOpen.value = false
}
</script>

<template>
  <div>
    <div class="flex gap-2 items-center pl-4">
      <p
        class="peer cursor-pointer"
        :class="{
          'text-white': type === 'player',
          'text-primary': type === 'summon',
          'text-success': type === 'npc',
          'text-danger': type === 'monster',
          'text-warning': type === 'lair',
        }"
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
      <h2>{{ $t('encounter.update.name') }}</h2>
      <FormKit
        v-model="form"
        type="form"
        :actions="false"

        @submit="updateName"
      >
        <Input
          focus
          name="name"
          :label="$t('inputs.nameLabel')"
          validation="required|length:3,30"
          required
        />
        <button
          type="submit"
          class="btn-black w-full mt-3"
          :aria-label="$t('actions.update')"
        >
          {{ $t('actions.update') }}
        </button>
      </FormKit>
    </Modal>
  </div>
</template>
