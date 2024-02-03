import * as fabric from 'fabric'

export function useFabricDraw (grid: number) {
  const isDrawingFloor = ref<boolean>(false)
  const isDrawingWall = ref<boolean>(false)

  function mouseDown (
    event: fabric.TPointerEvent,
    canvas?: fabric.Canvas,
    layer?: fabric.Group,
    sprite?: SpriteData
  ): void {
    if (
      !sprite ||
      !canvas ||
      !layer ||
      (event && !withinBoundaries(event as MouseEvent, canvas))
    ) { return }

    canvas.selection = false

    if (sprite.url.includes('floors')) {
      isDrawingFloor.value = true
    } else {
      isDrawingWall.value = true
    }

    createTile(canvas, layer, sprite, event)
  }

  function mouseMove (
    event: fabric.TPointerEvent,
    canvas?: fabric.Canvas,
    layer?: fabric.Group,
    sprite?: SpriteData
  ): void {
    if (
      (isDrawingFloor.value || isDrawingWall.value) &&
      sprite &&
      canvas &&
      layer &&
      withinBoundaries(event as MouseEvent, canvas)
    ) {
      createTile(canvas, layer, sprite, event)
    }
  }

  function mouseUp (canvas?: fabric.Canvas): void {
    if (!canvas) { return }

    canvas.selection = true
    isDrawingFloor.value = false
    isDrawingWall.value = false
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

        const adjacent = sprite.versions ? getAdjacentSprites(layer, coords, grid, sprite.value) : undefined

        if (adjacent) {
          await checkForUpdatingConnections(sprite, adjacent, layer, coords, canvas)
        }

        return
      }

      // If it's already the right sprite don't update it
      if (sameImgSource(occupiedSlot as fabric.Image, sprite.value)) { return }

      layer!.remove(occupiedSlot as fabric.Object)
    }

    // Don't create new sprite if it's the remove brush
    if (sprite.value === 'remove') { return }

    let imgUrl = sprite.url

    const adjacent = sprite.versions ? getAdjacentSprites(layer, coords, grid, sprite.value) : undefined

    if (sprite.variations) {
      imgUrl = sprite.url.replace('-1.svg', `-${Math.floor(Math.random() * sprite.variations) + 1}.svg`)
    } else if (sprite.versions && adjacent) {
      imgUrl = `${sprite.url.split(sprite.value)[0]}${sprite.value}-${createAdjacentString(adjacent, sprite.versions)}.svg`
    }

    const img = await fabric.util.loadImage(imgUrl)

    layer!.add(new fabric.Image(img, {
      left: coords.x,
      top: coords.y,
      width: grid,
      height: grid,
      selectable: false
    }))

    canvas!.requestRenderAll()

    await checkForUpdatingConnections(sprite, adjacent, layer, coords, canvas)
  }

  async function checkForUpdatingConnections (
    sprite: SpriteData,
    adjacent: AdjacentSprite | undefined,
    layer: fabric.Group,
    coords: fabric.Point,
    canvas: fabric.Canvas
  ): Promise<void> {
    if (sprite.versions && adjacent) {
      for (const connection in adjacent) {
        if (adjacent[connection as keyof AdjacentSprite]) {
          await handleConnection(connection as Connection, sprite, layer, coords, canvas)
        } else if (sprite.value === 'remove') {
          await handleRemoveConnection(connection as Connection, layer, coords, canvas)
        }
      }
    }
  }

  async function handleRemoveConnection (
    connection: Connection,
    layer: fabric.Group,
    coords: fabric.Point,
    canvas: fabric.Canvas
  ): Promise<void> {
    const cellCoords = getConnectedCellCoords(connection, coords, grid)
    const object = getGridObjectByCoords(layer, cellCoords)

    if (object) {
      layer.remove(object as fabric.Object)

      const sprite = (object as fabric.Image).getSrc().split('-')
      sprite.pop()
      sprite.join('-')

      const adjacent = getAdjacentSprites(layer, cellCoords, grid, sprite[0] as Sprite)

      const imgUrl = `${sprite[0]}-${createAdjacentString(adjacent)}.svg`

      const img = await fabric.util.loadImage(imgUrl)

      layer.add(new fabric.Image(img, {
        left: cellCoords.x,
        top: cellCoords.y,
        width: grid,
        height: grid,
        selectable: false
      }))

      canvas.requestRenderAll()
    }
  }

  async function handleConnection (
    connection: Connection,
    sprite: SpriteData,
    layer: fabric.Group,
    coords: fabric.Point,
    canvas: fabric.Canvas
  ): Promise<void> {
    const cellCoords = getConnectedCellCoords(connection, coords, grid)
    const object = getGridObjectByCoords(layer, cellCoords)

    if (object) {
      layer.remove(object as fabric.Object)

      const adjacent = getAdjacentSprites(layer, cellCoords, grid, sprite.value)

      const imgUrl = `${sprite.url.split(sprite.value)[0]}${sprite.value}-${createAdjacentString(adjacent, sprite.versions!)}.svg`

      const img = await fabric.util.loadImage(imgUrl)

      layer.add(new fabric.Image(img, {
        left: cellCoords.x,
        top: cellCoords.y,
        width: grid,
        height: grid,
        selectable: false
      }))

      canvas.requestRenderAll()
    }
  }

  return {
    mouseDown,
    mouseUp,
    mouseMove,
    fillBackground,
    isDrawingFloor,
    isDrawingWall
  }
}
