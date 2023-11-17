import * as fabric from 'fabric'

export function useFabricShapeDrawing () {
  const isDrawingShape = ref<boolean>(false)
  const line = ref<fabric.Line>()

  function mouseDown (canvas: fabric.Canvas, event: fabric.TPointerEventInfo<fabric.TPointerEvent>): void {
    // isDrawingShape.value = true

    // const pointer = canvas.getPointer(event.e)
    // const points = [pointer.x, pointer.y, pointer.x, pointer.y]

    // line.value = new fabric.Rect(points, {
    //   strokeWidth: 5,
    //   fill: 'red',
    //   stroke: 'red',
    //   originX: 'center',
    //   originY: 'center'
    // })

    // canvas.add(line.value)
  }

  function mouseMove (canvas: fabric.Canvas, event: fabric.TPointerEventInfo<fabric.TPointerEvent>): void {
    if (!isDrawingShape || !line.value) {
      return
    }

    const pointer = canvas.getPointer(event.e)

    line.value.set({ x2: pointer.x, y2: pointer.y })

    canvas.requestRenderAll()
  }

  function mouseUp (): void {
    isDrawingShape.value = false
  }

  return {
    isDrawingShape,
    mouseDown,
    mouseMove,
    mouseUp
  }
}
