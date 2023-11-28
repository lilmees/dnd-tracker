import * as fabric from 'fabric'
import sprites from '@/fixtures/sprites.json'
import { snapToGrid } from '@/utils/fabric-utils'

export const useMapBuilder = () => {
  const siteUrl = process.env.NODE_ENV === 'production' ? 'https://dnd-tracker.com' : 'http://localhost:3000'

  const canvas = ref<fabric.Canvas>()
  const floorLayer = ref<fabric.Group>(new fabric.Group([], { selectable: false }))
  const cellWidth = ref<number>(32)
  const isDrawingMode = ref<boolean>(false)
  const activeBrush = ref<FabricBrush>('Pencil')
  const activeColor = ref<string>('#000000')
  const brushSize = ref<string>('32')
  const draggedOver = ref<boolean>(false)
  const maxSprites = ref<number>(500)
  const spriteAmount = ref<number>(0)
  const spriteSelected = ref<boolean>(false)
  const selectedSprite = ref<Sprite>()

  const {
    mouseDown,
    mouseUp,
    mouseMove,
    fillBackground
  } = useFabricDrawing(cellWidth.value)

  function mount (element: HTMLCanvasElement): void {
    canvas.value = markRaw(
      new fabric.Canvas(element, {
        backgroundColor: '#21252EB3',
        isDrawingMode: isDrawingMode.value
      })
    )

    if (!canvas.value) {
      return
    }

    window.addEventListener('keydown', keydownHandler)

    canvas.value.add(floorLayer.value)

    setBrush('Pencil')

    // Draw grid lines on the canvas
    const options = { stroke: '#000000', strokeWidth: 2, selectable: false }
    for (let i = 1; i < canvas.value.getWidth() / cellWidth.value + 1; i++) {
      canvas.value.add(new fabric.Line([cellWidth.value * i, 0, cellWidth.value * i, 600], options))
      canvas.value.add(new fabric.Line([0, cellWidth.value * i, 600, cellWidth.value * i], options))
    }

    calculateCount()

    canvas.value.on({
      dragenter: () => { draggedOver.value = true },
      dragleave: () => { draggedOver.value = false },
      'object:added': e => calculateCount(e as { target: fabric.Object }),
      'object:removed': () => calculateCount(),
      'object:moving': ({ target }) => snapToGrid(target, cellWidth.value),
      'selection:created': () => { spriteSelected.value = true },
      'selection:cleared': () => { spriteSelected.value = false },
      'mouse:down': ({ e }) => {
        if (!selectedSprite.value) { return }
        mouseDown(e, canvas.value, floorLayer.value, getSprite('floors', selectedSprite.value))
      },
      'mouse:move': ({ e }) => {
        if (!selectedSprite.value) { return }
        mouseMove(e, canvas.value, floorLayer.value, getSprite('floors', selectedSprite.value))
      },
      'mouse:up': () => mouseUp(canvas.value)
    })

    // canvas.value.on('object:modified', e => handleBoundaries(e))
  }

  function calculateCount (event?: { target: fabric.Object }): void {
    let count: number = (canvas.value?.getObjects().length || 32) - 32 // minus grid lines

    if (event && count > maxSprites.value) {
      canvas.value?.remove(event.target)
      canvas.value?.requestRenderAll()
      count--
      // use a toast for max amount of sprites
    }

    spriteAmount.value = count
  }

  function getSprite (type: SpriteType, sprite: Sprite): SpriteData | undefined {
    const spriteMeta: SpriteMetaData<Sprite> | undefined = sprites[type].find(svg => svg.value === sprite)

    if (!spriteMeta) { return }

    return {
      url: `${siteUrl}/art/${type}/${sprite}${spriteMeta?.variations ? '-1' : ''}.svg`,
      ...spriteMeta
    }
  }

  async function createPattern (url: string): Promise<fabric.Pattern> {
    const patternImg = await fabric.util.loadImage(url)

    return new fabric.Pattern({ source: patternImg })
  }

  function setBackgroundImage (img: fabric.Image): void {
    canvas.value?.set({ backgroundImage: img })
    canvas.value?.requestRenderAll()
  }

  function add (object: fabric.Object): void {
    canvas.value?.add(object)
    canvas.value?.requestRenderAll()
  }

  function update (object: fabric.Object, key: string, value: any): void {
    object.set(key, value)
    object.setCoords()
    canvas.value?.requestRenderAll()
  }

  function remove (): void {
    canvas.value?.remove(...canvas.value.getActiveObjects())
    canvas.value?.discardActiveObject()
    canvas.value?.requestRenderAll()
  }

  function keydownHandler (e: KeyboardEvent): void {
    const object: fabric.Object | undefined = canvas.value?.getActiveObject()
    const step = 8

    if (!object || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return
    }

    e.preventDefault()

    switch (e.key) {
      case 'ArrowLeft':
        update(object, 'left', object.get('left') - step)
        break
      case 'ArrowUp':
        update(object, 'top', object.get('top') - step)
        break
      case 'ArrowRight':
        update(object, 'left', object.get('left') + step)
        break
      case 'ArrowDown':
        update(object, 'top', object.get('top') + step)
        break
      case 'Backspace':
        remove()
        break
    }
  }

  function handleBoundaries (event: any): void {
    // if (!canvas.value) {
    //   return
    // }
    // const obj = event.target
    // const boundingRect = obj.getBoundingRect(true)
    // if (
    //   boundingRect.left < 0 ||
    //   boundingRect.top < 0 ||
    //   boundingRect.left + boundingRect.width > canvas.value.getWidth() ||
    //   boundingRect.top + boundingRect.height > canvas.value.getHeight()
    // ) {
    //   obj.top = obj._stateProperties.top
    //   obj.left = obj._stateProperties.left
    //   obj.angle = obj._stateProperties.angle
    //   obj.scaleX = obj._stateProperties.scaleX
    //   obj.scaleY = obj._stateProperties.scaleY
    //   obj.setCoords()
    //   obj.saveState()
    // }
  }

  function toggleDrawing (value: boolean): void {
    isDrawingMode.value = value ?? !isDrawingMode.value
    canvas.value?.set('isDrawingMode', isDrawingMode.value)

    if (isDrawingMode.value) {
      selectedSprite.value = undefined
    }
  }

  function setBrush (brush: FabricBrush): void {
    if (!canvas.value) {
      return
    }

    activeBrush.value = brush

    canvas.value.freeDrawingBrush = new fabric[`${brush}Brush`](canvas.value)

    if (canvas.value.freeDrawingBrush) {
      canvas.value.freeDrawingBrush.width = +brushSize.value
      canvas.value.freeDrawingBrush.limitedToCanvasSize = true
      canvas.value.freeDrawingBrush.color = activeColor.value

      if (brush === 'Spray' && canvas.value.freeDrawingBrush?.density) {
        canvas.value.freeDrawingBrush.density = 50
      }
    }
  }

  function serializeCanvas (): void {}

  function deserializeCanvas (items: fabric.Object[]): void {
    if (!canvas.value) {
      return
    }

    // deze functie moet json naar fabric object casten maar werkt niet momenteel
    fabric.util.enlivenObjects(items, (objects) => {
      const origRenderOnAddRemove = canvas.value!.renderOnAddRemove
      canvas.value!.renderOnAddRemove = false

      objects.forEach((object: fabric.Object) => {
        canvas.value!.add(object)
      })

      canvas.value!.renderOnAddRemove = origRenderOnAddRemove
      canvas.value!.requestRenderAll()
    })
  }

  watch(
    () => brushSize.value,
    (size: string) => {
      if (canvas.value?.freeDrawingBrush) {
        canvas.value.freeDrawingBrush.width = +size
      }
    }
  )

  watch(
    () => activeColor.value,
    (color: string) => {
      if (canvas.value?.freeDrawingBrush) {
        canvas.value.freeDrawingBrush.color = color
      }
    }
  )

  onUnmounted(() => {
    window.removeEventListener('keydown', keydownHandler)
  })

  return {
    canvas,
    floorLayer,
    sprites,
    draggedOver,
    spriteAmount,
    maxSprites,
    isDrawingMode,
    activeBrush,
    brushSize,
    activeColor,
    spriteSelected,
    selectedSprite,
    mount,
    createPattern,
    getSprite,
    fillBackground,
    setBackgroundImage,
    add,
    remove,
    update,
    keydownHandler,
    toggleDrawing,
    setBrush
  }
}
