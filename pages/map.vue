<script setup lang="ts">
import * as fabric from 'fabric'
import { reset } from '@formkit/core'
import sprites from '@/fixtures/sprites.json'
import { readFile } from '@/utils/file-reader'
import { flip, clone, exportCanvas } from '@/utils/fabric-utils'

const {
  canvas,
  draggedOver,
  spriteAmount,
  maxSprites,
  isDrawingMode,
  brushSize,
  activeColor,
  activeBrush,
  spriteSelected,
  mount,
  getSprite,
  createPattern,
  setBackgroundPattern,
  setBackgroundImage,
  toggleDrawing,
  setBrush,
  update
} = useMapBuilder()

const canvasEl = ref<HTMLCanvasElement>()
const canvasContainer = ref<HTMLDivElement>()
const draggingImg = ref<HTMLImageElement>()

onMounted(() => {
  if (canvasEl.value && canvasContainer.value) {
    mount(canvasEl.value)
  }
})

// async function handleSubmit ({ type, sprite }: Obj): Promise<void> {
//   canvas.value?.add(await fabric.Image.fromURL(getSprite(type, sprite), {}, {}))
// }

async function changeBackground (sprite : FloorSprite): Promise<void> {
  setBackgroundPattern(await createPattern(getSprite('floors', sprite)))
}

function handleDrag (event: DragEvent): void {
  draggingImg.value = event.target as HTMLImageElement
}

function handleDrop (event: DragEvent): void {
  draggedOver.value = false

  if (!draggingImg.value) {
    return
  }

  const newImage = new fabric.Image(draggingImg.value, {
    width: 32,
    height: 32,
    left: event.offsetX - 16 < 0 ? 0 : event.offsetX,
    top: event.offsetY - 16 < 0 ? 0 : event.offsetY
  })

  canvas.value?.add(newImage)
  canvas.value?.requestRenderAll()
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
      <div class="flex justify-center items-start w-full gap-4">
        <div class="space-y-4">
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
                @click="toggleDrawing"
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
        <div class="space-y-4 relative">
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
          <div>
            <p class="font-bold mb-1 body-small">
              Background
            </p>
            <div class="flex gap-3 items-center">
              <button class="btn-primary" @click="changeBackground('brick')">
                Brick
              </button>
              <button class="btn-primary" @click="changeBackground('tile')">
                Tile
              </button>
              <button class="btn-primary" @click="changeBackground('small-tile')">
                Small tile
              </button>
            </div>
            <div class="bg-tracker/50 border-4 border-tracker p-4 rounded-lg mt-4">
              <p class="head-3 mb-2">
                Custom background
              </p>
              <FormKit
                id="form"
                type="form"
                :actions="false"
                @submit="handleSubmit"
              >
                <FormKit
                  name="file"
                  type="file"
                  accept=".png,.svg,.jpg,.jpeg"
                  validation="required"
                />
                <FormKit type="submit">
                  Add backgorund
                </FormKit>
              </FormKit>
            </div>
          </div>
          <div class="space-y-2">
            <h3>Todo's</h3>
            <ul class="list-disc ml-4">
              <li>Draw shapes</li>
              <li>Toast for max amount of sprites</li>
              <li>Zoom options</li>
              <li>Draw fog and remove fog</li>
              <li>Tile maps</li>
              <li>No items out of the map</li>
            </ul>
          </div>
        </div>
        <div class="bg-tracker/50 border-4 border-tracker p-4 rounded-lg max-w-sm">
          <template v-for="key in Object.keys(sprites)" :key="key">
            <h2 class="first:pt-0 py-2">
              {{ key }}
            </h2>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="sprite in sprites[key as keyof SpriteMap]"
                :key="sprite.value"
                class="w-12"
              >
                <NuxtImg
                  :id="sprite.value"
                  :draggable="true"
                  :src="`/art/${key}/${sprite.value}.svg`"
                  class="w-12 h-12"
                  @drag.stop="handleDrag"
                />
                <p class="body-extra-small font-bold text-center">
                  {{ sprite.label }}
                </p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
