import * as fabric from 'fabric'
import { getGridObjectByCoords } from '@/utils/fabric-utils'

export function useFabricDrawFloor (grid: number) {
  const isDrawingFloor = ref<boolean>(false)

  function mouseDownFloor (
    event: fabric.TPointerEvent,
    canvas?: fabric.Canvas,
    layer?: fabric.Group,
    sprite?: SpriteData
  ): void {
    if (!sprite || !canvas || !layer) { return }

    canvas.selection = false

    isDrawingFloor.value = true

    createTile(canvas, layer, sprite, event)
  }

  function mouseMoveFloor (
    event: fabric.TPointerEvent,
    canvas?: fabric.Canvas,
    layer?: fabric.Group,
    sprite?: SpriteData
  ): void {
    if (!isDrawingFloor.value || !sprite || !canvas || !layer) { return }

    createTile(canvas, layer, sprite, event)
  }

  function mouseUpFloor (canvas?: fabric.Canvas): void {
    if (!canvas) { return }

    canvas.selection = true
    isDrawingFloor.value = false
  }

  function fillBackground (
    sprite: SpriteData,
    canvas: fabric.Canvas,
    layer: fabric.Group
  ): void {
    if (!sprite || !canvas || !layer) { return }

    const xCells: number = canvas.getWidth() / grid
    const yCells: number = canvas.getHeight() / grid

    for (let i = 0; i < xCells; i++) {
      for (let j = 0; j < yCells; j++) {
        createTile(canvas, layer, sprite, { x: j * grid, y: i * grid })
      }
    }
  }

  async function createTile (
    canvas: fabric.Canvas,
    layer: fabric.Group,
    sprite: SpriteData,
    event: fabric.TPointerEvent | Coords
  ): Promise<void> {
    const pointer: Coords = event instanceof Object && 'target' in event
      ? canvas!.getPointer(event)
      : event

    // Snap to grid
    const coords = {
      x: Math.floor(pointer.x / grid) * grid,
      y: Math.floor(pointer.y / grid) * grid
    } as fabric.Point

    const occupiedSlot = getGridObjectByCoords(layer!, coords)

    if (occupiedSlot) {
      // Remove brush
      if (sprite.value === 'remove') {
        layer!.remove(occupiedSlot as fabric.Object)
        canvas!.requestRenderAll()

        return
      }

      // If it's already the right sprite don't update it
      if (occupiedSlot.getSrc()?.includes(sprite.value)) { return }

      layer!.remove(occupiedSlot as fabric.Object)
    }

    // Don't create new sprite if it's the remove brush
    if (sprite.value === 'remove') { return }

    const imgUrl = sprite.variations
      ? sprite.url.replace('-1.svg', `-${Math.floor(Math.random() * sprite.variations) + 1}.svg`)
      : sprite.url

    const img = await fabric.util.loadImage(imgUrl)

    layer!.add(new fabric.Image(img, {
      left: coords.x,
      top: coords.y,
      width: grid,
      height: grid,
      selectable: false
    }))

    canvas!.requestRenderAll()
  }

  return {
    mouseDownFloor,
    mouseUpFloor,
    mouseMoveFloor,
    fillBackground,
    isDrawingFloor
  }
}
