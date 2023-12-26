import * as fabric from 'fabric'

export function flip (
  axis: 'x' | 'y',
  canvas: fabric.Canvas|undefined,
  cb: (object: fabric.Object, key: string, value: boolean) => void
): void {
  const object = canvas?.getActiveObject()

  if (!object) {
    return
  }

  const key = `flip${axis.toUpperCase()}`

  cb(object, key, !object.get(key))
}

export function clone (canvas: fabric.Canvas | undefined): void {
  const activeObjects = canvas?.getActiveObjects()

  if (!activeObjects || !activeObjects.length) {
    return
  }

  activeObjects.forEach(async (obj) => {
    const clone: fabric.Object = await obj.clone()

    clone.set({ top: obj.top + 8, left: obj.left + 8 })

    canvas?.add(clone)
  })

  canvas?.discardActiveObject()
  canvas?.requestRenderAll()
}

export function exportCanvas (canvas: fabric.Canvas | undefined): void {
  if (!canvas) {
    return
  }

  const link = document.createElement('a')
  link.href = canvas.toDataURL()
  link.download = 'dnd-tracker-map.png'
  link.click()
}

export function snapToGrid (object: fabric.Object, grid: number): void {
  object?.set({
    left: Math.floor(object.left / grid) * grid,
    top: Math.floor(object.top / grid) * grid
  })
}

export function getCoordsFromGroupItem (group: fabric.Group, object: fabric.BaseFabricObject): fabric.Point {
  return {
    x: object.left + group.left + group.width / 2,
    y: object.top + group.top + group.height / 2
  } as fabric.Point
}

export function getGridObjectByCoords (group: fabric.Group, point: fabric.Point): fabric.BaseFabricObject | undefined {
  for (const object of group.getObjects()) {
    const { x, y } = getCoordsFromGroupItem(group, object)

    if (point.x === x && point.y === y) {
      return object
    }
  }
}

export function pixelToGrid (pixel: number, grid: number): number {
  return Math.floor(pixel / grid)
}

export function sameImgSource (object: fabric.Image, sprite: Sprite): boolean {
  return object.getSrc().includes(sprite)
}

export function getAdjacentSprites (
  group: fabric.Group,
  coords: Coords,
  grid: number,
  sprite?: Sprite,
  sameImage = true
): AdjacentSprite {
  let left = false
  let right = false
  let bottom = false
  let top = false

  const xCoords = pixelToGrid(coords.x, grid)
  const yCoords = pixelToGrid(coords.y, grid)

  for (const object of group.getObjects()) {
    if ((sprite && sameImage && sameImgSource(object as fabric.Image, sprite)) || !sameImage) {
      const { x, y } = getCoordsFromGroupItem(group, object)
      const xItem = pixelToGrid(x, grid)
      const yItem = pixelToGrid(y, grid)

      // Vertical
      if (xItem === xCoords) {
        bottom = bottom || yItem - 1 === yCoords
        top = top || yItem + 1 === yCoords
      }

      // Horizontal
      if (yItem === yCoords) {
        left = left || xItem + 1 === xCoords
        right = right || xItem - 1 === xCoords
      }
    }
  }

  return { left, right, bottom, top }
}

export function createAdjacentString (
  { left, right, bottom, top }: AdjacentSprite,
  versions?: SpriteDirection[]
): SpriteDirection {
  if (!left && !right && !bottom && !top) {
    return 'default'
  }

  let string = ''

  if (left) { string += 'l' }
  if (right) { string += 'r' }
  if (top) { string += 't' }
  if (bottom) { string += 'b' }

  return string === '' ? 'default' : string as SpriteDirection
}

export function getConnectedCellCoords (
  connection: Connection,
  coords: fabric.Point,
  grid: number
): fabric.Point {
  let { x, y } = coords

  switch (connection) {
    case 'left':
      x -= grid
      break
    case 'right':
      x += grid
      break
    case 'bottom':
      y += grid
      break
    case 'top':
      y -= grid
      break
  }

  return { x, y } as fabric.Point
}

export async function createPattern (url: string): Promise<fabric.Pattern> {
  const patternImg = await fabric.util.loadImage(url)

  return new fabric.Pattern({ source: patternImg })
}

export function setViewPortTransformWithinBounds (
  vpt: fabric.TMat2D,
  zoom: number,
  width: number,
  height: number,
  cb?: () => void
): void {
  if (zoom < 200 / width) {
    vpt[4] = 200 - width * zoom / 2
    vpt[5] = 200 - height * zoom / 2
  } else {
    if (cb) { cb() }
    if (vpt[4] >= 0) {
      vpt[4] = 0
    } else if (vpt[4] < width - width * zoom) {
      vpt[4] = width - width * zoom
    }
    if (vpt[5] >= 0) {
      vpt[5] = 0
    } else if (vpt[5] < height - height * zoom) {
      vpt[5] = height - height * zoom
    }
  }
}

export function withinBoundaries (event: MouseEvent, canvas: fabric.Canvas): boolean {
  const width = canvas.getWidth()
  const height = canvas.getHeight()
  const { x, y } = canvas.getPointer(event)

  return !(x < 0 || x > height || y < 0 || y > width)
}

export function clipPathToPolygon (clipPath: string, width: number, height: number): Coords[] {
  return clipPath.split(',').map((point) => {
    const coords = point.trim().split(' ')

    return {
      x: (parseFloat(coords[0]) / 100) * width,
      y: (parseFloat(coords[1]) / 100) * height
    }
  })
}
