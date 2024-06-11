<script setup lang="ts">
import type * as fabric from 'fabric'
import { reset } from '@formkit/core'

const emit = defineEmits(['add'])

const props = defineProps<{
  grid: number,
  tooltip?: AOETooltip
}>()

const form = ref<ShapeForm>({ shape: 'Rectangle' })

function createShape ({ shape, width, height, radius }: Obj): void {
  let object: fabric.Object

  switch (shape) {
    case 'Rectangle':
      object = createRectangle(width, height, props.grid)
      break
    case 'Cube':
      object = createCube(width, props.grid)
      break
    case 'Cone':
      object = createCone(width, height, props.grid)
      break
    case 'Line':
      object = createLine(height, props.grid)
      break
    default:
      object = createSphere(radius, props.grid)
      break
  }

  emit('add', object)
  reset('shapes')
}
</script>

<template>
  <div
    v-if="tooltip && !tooltip.hidden"
    class="bg-black/50 backdrop-blur body-small rounded-lg absolute p-2 flex flex-col gap-1 z-[1]"
    :style="{ left: tooltip.left, top: tooltip.top }"
  >
    <div v-for="key in Object.keys(tooltip.aoe || {})" :key="key">
      <span> {{ $t(`general.${key}`) }}: </span>
      <span class="font-bold"> {{ tooltip.aoe![key as keyof AOE] }} </span>
      <span class="body-extra-small"> ft </span>
    </div>
  </div>
  <FormKit
    id="shapes"
    v-model="form"
    type="form"
    :actions="false"
    @submit="createShape"
  >
    <FormKit
      type="togglebuttons"
      name="shape"
      label="AOE shape"
      :options="['Rectangle', 'Cube', 'Cone', 'Line', 'Sphere']"
      validation="required"
    >
      <template #default="context">
        <Icon
          :name="getShapeIcon(context.option.value)"
          class="w-6 h-6"
          :class="getShapeColor(context.option.value)"
          aria-hidden="true"
        />
      </template>
    </FormKit>
    <FormKit
      v-if="['Rectangle', 'Cube', 'Cone'].includes(form.shape)"
      type="number"
      name="width"
      label="width (ft)"
      validation="max:80|min:5|required"
      :min="5"
      :step="5"
    />
    <FormKit
      v-if="['Rectangle', 'Cone', 'Line'].includes(form.shape)"
      type="number"
      name="height"
      label="Height (ft)"
      validation="max:80|min:5|required"
      :min="5"
      :step="5"
    />
    <FormKit
      v-if="['Sphere'].includes(form.shape)"
      type="number"
      name="radius"
      label="Radius (ft)"
      validation="max:40|min:5|required"
      :step="5"
    />
    <FormKit type="submit">
      Create shape
    </FormKit>
  </FormKit>
</template>
