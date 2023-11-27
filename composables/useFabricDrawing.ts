import * as fabric from 'fabric'
import { getGridObjectByCoords } from '@/utils/fabric-utils'

export function useFabricDrawing (grid: number) {
  const isDrawing = ref<boolean>(false)

  function mouseDown (
    event: fabric.TPointerEvent,
    canvas?: fabric.Canvas,
    floorLayer?: fabric.Group,
    sprite?: SpriteData
  ): void {
    if (!sprite || !canvas || !floorLayer) { return }

    canvas.selection = false

    isDrawing.value = true

    createTile(canvas, floorLayer, sprite, event)
  }

  function mouseMove (
    event: fabric.TPointerEvent,
    canvas?: fabric.Canvas,
    floorLayer?: fabric.Group,
    sprite?: SpriteData
  ): void {
    if (!isDrawing.value || !sprite || !canvas || !floorLayer) { return }

    createTile(canvas, floorLayer, sprite, event)
  }

  function mouseUp (canvas?: fabric.Canvas): void {
    if (!canvas) { return }

    canvas.selection = true
    isDrawing.value = false
  }

  function fillBackground (
    sprite: SpriteData,
    canvas: fabric.Canvas,
    floorLayer: fabric.Group
  ): void {
    if (!sprite || !canvas || !floorLayer) { return }

    const xCells: number = canvas.getWidth() / grid
    const yCells: number = canvas.getHeight() / grid

    for (let i = 0; i < xCells; i++) {
      for (let j = 0; j < yCells; j++) {
        createTile(canvas, floorLayer, sprite, { x: j * grid, y: i * grid })
      }
    }
  }

  async function createTile (
    canvas: fabric.Canvas,
    floorLayer: fabric.Group,
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

    const occupiedSlot = getGridObjectByCoords(floorLayer!, coords)

    if (occupiedSlot) {
      // Remove brush
      if (sprite.value === 'remove') {
        floorLayer!.remove(occupiedSlot as fabric.Object)
        canvas!.requestRenderAll()

        return
      }

      // If it's already the right sprite don't update it
      if (occupiedSlot.getSrc()?.includes(sprite.value)) { return }

      floorLayer!.remove(occupiedSlot as fabric.Object)
    }

    // Don't create new sprite if it's the remove brush
    if (sprite.value === 'remove') { return }

    const imgUrl = sprite.variations
      ? sprite.url.replace('-1.svg', `-${Math.floor(Math.random() * sprite.variations) + 1}.svg`)
      : sprite.url

    const img = await fabric.util.loadImage(imgUrl)

    floorLayer!.add(new fabric.Image(img, {
      left: coords.x,
      top: coords.y,
      width: grid,
      height: grid,
      selectable: false
    }))

    canvas!.requestRenderAll()
  }

  return {
    mouseDown,
    mouseUp,
    mouseMove,
    fillBackground
  }
}
