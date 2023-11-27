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
