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
