<script setup lang="ts">
defineEmits(['handleDrag'])

const props = defineProps<{ sprites: SpriteMap }>()

const open = ref<number[]>([])
const search = ref<string>('')

const filteredSprites = computed<DraggableSprites>(() => {
  const filters = {
    monsters: props.sprites.monsters.filter(sprite => searchSprite(sprite.label)),
    characters: props.sprites.characters.filter(sprite => searchSprite(sprite.label)),
    animals: props.sprites.animals.filter(sprite => searchSprite(sprite.label)),
    items: props.sprites.items.filter(sprite => searchSprite(sprite.label)),
    nature: props.sprites.nature.filter(sprite => searchSprite(sprite.label))
  }

  search.value ? setOpenState(filters) : open.value = []

  return filters
})

function searchSprite (label: string): boolean {
  return label.toLowerCase().includes(search.value.trim())
}

function setOpenState (filters: DraggableSprites): void {
  open.value = Object.keys(filters).reduce((
    acc: number[],
    key: Omit<SpriteType, 'walls'|'floors'>,
    i: number
  ) => {
    if (filters[key as keyof DraggableSprites].length) {
      acc.push(i)
    }
    return acc
  }, [])
}
</script>

<template>
  <div class="rounded-lg p-4 bg-tracker/50 space-y-4 border-4 border-tracker">
    <h3>
      Sprites
    </h3>
    <FormKit
      v-model="search"
      type="search"
      suffix-icon="search"
      outer-class="$reset !pb-0 grow"
    />
    <div
      v-for="(category, index) in Object.keys(filteredSprites)"
      :key="index"
      class="pb-2 border-b-2 last:border-b-0 last:pb-2 border-tracker"
    >
      <button
        class="flex w-full justify-between items-center outline-none"
        @click="
          open = open.includes(index)
            ? open.filter(number => number !== index)
            : [...open, index]
        "
        @keydown.escape="open = []"
      >
        <p class="font-bold">
          {{ $t(`general.${category}`) }}
        </p>
        <Icon
          name="tabler:chevron-down"
          class="duration-200 h-6 w-6 stroke-2"
          :class="{ 'rotate-180': open.includes(index) }"
          aria-hidden="true"
        />
      </button>
      <Transition
        name="expand"
        @enter="start"
        @after-enter="end"
        @before-leave="start"
        @after-leave="end"
      >
        <template v-if="open.includes(index)">
          <div
            class="flex flex-wrap gap-2 border-t-2 border-tracker mt-2 pt-1 max-h-[300px] xl:max-h-[200px] overflow-y-auto overflow-x-hidden"
          >
            <button
              v-for="sprite in filteredSprites[category as keyof Omit<SpriteMap, 'walls'|'floors'>]"
              :key="sprite.value"
              :aria-label="sprite.value"
              class="w-12"
            >
              <img
                :id="sprite.value"
                :draggable="true"
                :src="`/art/${category}/${sprite.value}.svg`"
                loading="lazy"
                class="w-12 h-12"
                @drag.stop="$emit('handleDrag', $event)"
              >
              <p class="body-extra-small font-bold text-center">
                {{ sprite.label }}
              </p>
            </button>
          </div>
        </template>
      </Transition>
    </div>
  </div>
</template>
