<script setup lang="ts">
defineEmits(['remove', 'add'])
withDefaults(
  defineProps<{
    condition: Condition,
    removable?: boolean,
    addable?: boolean,
    selected?: boolean,
    color?: Color
  }>(), {
    removable: false,
    addable: false,
    selected: true,
    color: 'danger'
  }
)
</script>

<template>
  <div
    class="px-3 py-1 font-semibold leading-tight rounded-lg flex gap-2 w-fit items-center text-white"
    :class="{
      'bg-primary/50 ring-primary': color === 'primary',
      'bg-secondary/50 ring-secondary': color === 'secondary',
      'bg-success/50 ring-success': color === 'success',
      'bg-info/50 ring-info': color === 'info',
      'bg-warning/50 ring-warning': color === 'warning',
      'bg-help/50 ring-help': color === 'help',
      'bg-danger/50 ring-danger': color === 'danger',
      'ring-2': selected,
    }"
  >
    <Icon
      v-if="removable"
      v-tippy="{ content: $t('actions.remove') }"
      name="ic:round-clear"
      class="w-6 h-6 cursor-pointer hover:scale-110 duration-200 ease-in-out outline-none"
      :aria-label="$t('actions.remove')"
      aria-hidden="true"
      @click="$emit('remove', condition.slug)"
    />
    <Icon
      v-if="addable && !removable"
      v-tippy="{ content: $t('actions.add') }"
      name="material-symbols:add"
      class="w-6 h-6 cursor-pointer hover:scale-110 duration-200 ease-in-out outline-none"
      aria-hidden="true"
      :aria-label="$t('actions.add')"
      @click="$emit('add', condition)"
    />
    <div>
      {{ condition.name }}
    </div>
    <tippy>
      <Icon
        name="material-symbols:info-outline-rounded"
        class="w-6 h-6 hover:scale-110 cursor-pointer outline-none"
        aria-hidden="true"
      />
      <template #content>
        <div class="p-4 space-y-2 overflow-auto">
          <h3>
            {{ condition.name }}
          </h3>
          <template v-if="condition.desc">
            <template v-if="condition.name === 'Exhaustion'">
              <ul class="mx-6">
                <li
                  v-for="bullet in condition.desc.replace('*','').split(/\|\s\d+\s+\|/g).slice(1)"
                  :key="bullet"
                  class="list-decimal body-small pb-1"
                >
                  {{ bullet.split('|')[0] }}
                </li>
              </ul>
            </template>
            <ul v-else class="mx-6">
              <li
                v-for="bullet in condition.desc.replace('*','').split(/\s\*\s/g)"
                :key="bullet"
                class="list-disc body-small pb-1"
              >
                {{ bullet }}
              </li>
            </ul>
          </template>
        </div>
      </template>
    </tippy>
  </div>
</template>
