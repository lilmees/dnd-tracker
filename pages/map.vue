<script setup lang="ts">
import * as fabric from 'fabric'
import { reset } from '@formkit/core'
import { readFile } from '@/utils/file-reader'
import { flip, clone, exportCanvas } from '@/utils/fabric-utils'

const {
  canvas,
  floorLayer,
  sprites,
  draggedOver,
  spriteAmount,
  maxSprites,
  isDrawingMode,
  brushSize,
  activeColor,
  activeBrush,
  spriteSelected,
  selectedSprite,
  selectedType,
  mount,
  getSprite,
  fillBackground,
  setBackgroundImage,
  toggleDrawing,
  setBrush,
  setSprite,
  update,
  add
} = useMapBuilder()

const canvasEl = ref<HTMLCanvasElement>()
const canvasContainer = ref<HTMLDivElement>()
const draggingSprite = ref<{ sprite: Sprite, type: SpriteType }>()

onMounted(() => {
  if (canvasEl.value && canvasContainer.value) {
    mount(canvasEl.value)
  }
})

// async function handleSubmit ({ type, sprite }: Obj): Promise<void> {
//   canvas.value?.add(await fabric.Image.fromURL(getSprite(type, sprite), {}, {}))
// }

function changeBackground (sprite : Sprite): void {
  const spriteData = getSprite('floors', sprite)

  if (spriteData && canvas.value) {
    fillBackground(spriteData, canvas.value, floorLayer.value)
  }
}

function handleDrag (event: DragEvent): void {
  if (event.target?.src) {
    const split = event.target.src.split('/')

    draggingSprite.value = {
      sprite: split.at(-1).replace('.svg', ''),
      type: split.at(-2)
    }
  }
}

async function handleDrop (event: DragEvent): Promise<void> {
  draggedOver.value = false

  if (!draggingSprite.value) { return }

  const spriteData = getSprite(draggingSprite.value.type, draggingSprite.value.sprite)

  if (!spriteData) { return }

  const img = await fabric.util.loadImage(spriteData.url)

  const width = spriteData.size?.width || 32
  const height = spriteData.size?.height || 32
  const offsetX = event.offsetX - (width / 2)
  const offsetY = event.offsetY - (height / 2)

  add(new fabric.Image(img, {
    width,
    height,
    left: offsetX < 0 ? 0 : offsetX,
    top: offsetY < 0 ? 0 : offsetY
  }))

  draggingSprite.value = undefined
}

function handleSubmit ({ __init, file }: Obj): void {
  const maxSize = 524288 // 0.5MB

  if (file[0].file.size > maxSize) {
    alert('File is too big!')
  } else {
    readFile(file[0].file, (e: ProgressEvent) => {
      const htmlImg = new Image()

      htmlImg.onload = () => {
        if (!canvas.value) {
          return
        }

        const img = new fabric.Image(htmlImg, {
          scaleX: canvas.value.width / htmlImg.width,
          scaleY: canvas.value.height / htmlImg.height
        })

        setBackgroundImage(img)
      }

      if (e.target?.result) {
        htmlImg.src = e.target.result as string
      }
    })
  }

  reset('form')
}
</script>

<template>
  <NuxtLayout>
    <div class="flex flex-col gap-6 items-center">
      <div class="flex gap-4">
        <div class="space-y-4 w-full">
          <div
            class="bg-tracker/50 border-4 border-tracker p-4 rounded-lg space-y-4 transition-colors duration-200 ease-in-out"
            :class="{ '!border-success': selectedSprite }"
          >
            <h3>
              Tile set
            </h3>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="sprite in sprites['floors']"
                :key="sprite.value"
                class="w-12 p-1 transition-colors duration-200 ease-in-out"
                :class="{
                  'bg-primary/50 rounded-lg': sprite.value === selectedSprite
                }"
              >
                <NuxtImg
                  :id="sprite.value"
                  :draggable="true"
                  :src="`/art/floors/${sprite.value}${sprite.variations ? '-1' : ''}.svg`"
                  class="w-12 h-12"
                  @click="setSprite(sprite.value as Sprite, 'floors')"
                />
                <p class="body-extra-small font-bold text-center">
                  {{ sprite.label }}
                </p>
              </div>
            </div>
            <div class="flex gap-2 flex-wrap">
              <span> Utils: </span>
              <button
                :disabled="!selectedSprite"
                class="disabled:opacity-50 disabled:cursor-not-allowed"
                @click="changeBackground(selectedSprite!)"
              >
                <Icon name="bxs:color-fill" class="w-6 h-6" />
              </button>
            </div>
            <div class="border-t-4 border-tracker pt-4">
              <FormKit
                id="form"
                type="form"
                :actions="false"

                @submit="handleSubmit"
              >
                <FormKit
                  label="Custom background"
                  name="file"
                  type="file"
                  accept=".png,.svg,.jpg,.jpeg"
                  validation="required"
                />
                <FormKit type="submit">
                  Add background
                </FormKit>
              </FormKit>
            </div>
          </div>
          <div
            class="bg-tracker/50 border-4 border-tracker p-4 rounded-lg transition-colors duration-200 ease-in-out"
            :class="{ '!border-success': isDrawingMode }"
          >
            <h3 class="mb-4">
              Drawing Tools
            </h3>
            <div class="space-y-4">
              <FormKit
                v-model="brushSize"
                type="slider"
                :label="`Brush size: ${brushSize}px`"
                min="1"
                max="150"
              />
              <FormKit
                type="colorpicker"
                label="Color picker"
                format="hex"
                inline
                @input="activeColor = $event || '#000000'"
              />
              <div class="flex gap-2 flex-wrap">
                <span> Brushes: </span>
                <button @click="setBrush('Pencil')">
                  <Icon
                    name="ph:pencil-bold"
                    class="w-6 h-6 transition-colors duration-300 ease-in-out"
                    :class="{ 'text-primary': activeBrush === 'Pencil' }"
                  />
                </button>
                <button @click="setBrush('Spray')">
                  <Icon
                    name="tabler:spray"
                    class="w-6 h-6 transition-colors duration-300 ease-in-out"
                    :class="{ 'text-primary': activeBrush === 'Spray' }"
                  />
                </button>
                <button @click="setBrush('Eraser')">
                  <Icon
                    name="ph:eraser-bold"
                    class="w-6 h-6 transition-colors duration-300 ease-in-out"
                    :class="{ 'text-primary': activeBrush === 'Eraser' }"
                  />
                </button>
              </div>
              <div class="flex gap-2 flex-wrap">
                <span> Utils: </span>
                <button
                  :disabled="!spriteSelected"
                  class="disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="flip('x', canvas, update)"
                >
                  <Icon name="uil:flip-v-alt" class="w-6 h-6" />
                </button>
                <button
                  :disabled="!spriteSelected"
                  class="disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="flip('y', canvas, update)"
                >
                  <Icon name="uil:flip-h-alt" class="w-6 h-6" />
                </button>
                <button
                  :disabled="!spriteSelected"
                  class="disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="clone(canvas)"
                >
                  <Icon name="ph:copy-bold" class="w-6 h-6" />
                </button>
              </div>
              <button
                class="w-full flex items-center justify-center gap-2"
                :class="[isDrawingMode ? 'btn-success' : 'btn-danger']"
                @click="toggleDrawing(undefined)"
              >
                <Icon name="ic:outline-draw" />
                Draw mode
              </button>
            </div>
          </div>
          <button class="btn-primary w-full" @click="exportCanvas(canvas)">
            Export
          </button>
        </div>
        <div class="w-[512px] space-y-4 relative">
          <div>
            <div
              ref="canvasContainer"
              class="border-tracker border-4 rounded-lg w-fit transition-colors duration-200 ease-in-out"
              :class="{ '!border-success': draggedOver }"
              @drop.prevent.stop="handleDrop"
            >
              <canvas ref="canvasEl" width="512" height="512" class="rounded" />
            </div>
            <div class="flex justify-end" :class="{ 'text-danger': spriteAmount >= maxSprites }">
              {{ spriteAmount }} / {{ maxSprites }}
            </div>
          </div>
          <div class="space-y-2">
            <h3>Todo's</h3>
            <ul class="list-disc ml-4">
              <li>Drawing conected textures (walls, fences?)</li>
              <li>Optimize svg's</li>
              <li>Save button</li>
              <li>Option to toggle Snap to grid</li>
              <li>Option to toggle grid lines</li>
              <li>When clicking inside drawing option auto enable drawing mode/background mode</li>
              <li>Toast for max amount of sprites</li>
              <li>Zoom options</li>
              <li>Draw fog and remove fog (eraser brush is currently not updated in the library i use for rendering. So i have to wait on them)</li>
              <li>No items out of the map</li>
            </ul>
          </div>
        </div>
        <div class="w-full">
          <Accordion :sections="['monsters', 'characters', 'animals', 'items', 'nature']">
            <template
              v-for="category in ['monsters', 'characters', 'animals', 'items', 'nature']"
              :key="category"
              #[category]
            >
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="sprite in sprites[category as keyof SpriteMap]"
                  :key="sprite.value"
                  class="w-12"
                >
                  <NuxtImg
                    :id="sprite.value"
                    :draggable="true"
                    :src="`/art/${category}/${sprite.value}.svg`"
                    class="w-12 h-12"
                    @drag.stop="handleDrag"
                  />
                  <p class="body-extra-small font-bold text-center">
                    {{ sprite.label }}
                  </p>
                </div>
              </div>
            </template>
          </Accordion>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
