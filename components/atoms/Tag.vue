<script setup lang="ts">
const emit = defineEmits(['remove', 'add', 'update'])
const props = withDefaults(
  defineProps<{
    condition: Condition,
    removable?: boolean,
    addable?: boolean,
    selected?: boolean,
    color?: Color
  }>(), {
    removable: false,
    addable: false,
    selected: false,
    color: 'black'
  }
)

const amount = ref<number>(props.condition.level || 1)

watch(() => amount.value, (v) => {
  emit('update', { ...props.condition, level: v })
})

function listFromText (text: string, exhaustion: boolean = false): string[] {
  return exhaustion
    ? text.replace('*', '').split(/\|\s\d+\s+\|/g).slice(1).map(bullet => bullet.split('|')[0])
    : text.replace('*', '').split(/\s\*\s/g)
}
</script>

<template>
  <div
    class="px-2 py-1 font-semibold leading-tight rounded-lg flex gap-2 w-fit items-center text-white border-4 transition-colors duration-200"
    :class="{
      'bg-black/50 border-black': color === 'black',
      'bg-primary/50 border-primary': color === 'primary',
      'bg-secondary/50 border-secondary': color === 'secondary',
      'bg-success/50 border-success': color === 'success',
      'bg-info/50 border-info': color === 'info',
      'bg-warning/50 border-warning': color === 'warning',
      'bg-help/50 border-help': color === 'help',
      'bg-danger/50  border-danger': color === 'danger',
      'border-white': selected,
    }"
  >
    <NumberSelector
      v-if="condition.hasLevels && !addable"
      v-model="amount"
      :max="6"
      :min="1"
    />
    <tippy :delay="0">
      <span>
        {{ condition.name }}
      </span>
      <template #content>
        <div class="p-4 space-y-2 overflow-auto">
          <h3>
            {{ condition.name }}
          </h3>
          <template v-if="condition.desc">
            <ul class="mx-6">
              <li
                v-for="bullet in listFromText(condition.desc, condition.name === 'Exhaustion')"
                :key="bullet"
                class="body-small pb-1"
                :class="[condition.name === 'Exhaustion' ? 'list-decimal' : 'list-disc']"
              >
                {{ bullet }}
              </li>
            </ul>
          </template>
        </div>
      </template>
    </tippy>
    <button
      v-if="removable"
      v-tippy="{ content: $t('actions.remove') }"
      :aria-label="$t('actions.remove')"
      class="icon-btn-danger group"
      @click="$emit('remove', condition.slug)"
    >
      <Icon
        name="ic:round-clear"
        class="icon"
        aria-hidden="true"
      />
    </button>
    <button
      v-if="addable && !removable"
      v-tippy="{ content: $t('actions.add') }"
      :aria-label="$t('actions.add')"
      class="icon-btn-success group"
      @click="$emit('add', condition)"
    >
      <Icon
        name="material-symbols:add"
        class="icon"
        aria-hidden="true"
      />
    </button>
  </div>
</template>
