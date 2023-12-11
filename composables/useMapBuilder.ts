import * as fabric from 'fabric'
import sprites from '@/fixtures/sprites.json'
import { snapToGrid } from '@/utils/fabric-utils'

export const useMapBuilder = () => {
  const siteUrl = process.env.NODE_ENV === 'production' ? 'https://dnd-tracker.com' : 'http://localhost:3000'

  const canvas = ref<fabric.Canvas>()
  const floorLayer = ref<fabric.Group>(new fabric.Group([], { selectable: false }))
  const middleLayer = ref<fabric.Group>(new fabric.Group([], { selectable: false }))
  const gridLayer = ref<fabric.Group>(new fabric.Group([], { selectable: false }))

  const cellWidth = ref<number>(32)
  const isDrawingMode = ref<boolean>(false)
  const activeBrush = ref<FabricBrush>('Pencil')
  const activeColor = ref<string>('#000000')
  const brushSize = ref<string>('32')
  const draggedOver = ref<boolean>(false)
  const maxSprites = ref<number>(250)
  const spriteAmount = ref<number>(0)
  const spriteSelected = ref<boolean>(false)
  const showGrid = ref<boolean>(true)
  const useSnapToGrid = ref<boolean>(false)
  const selectedSprite = ref<Sprite>()
  const selectedType = ref<SpriteType>()
  const recentCategorySearch = ref<{ sprite: Sprite, category: SpriteType }>()

  const {
    mouseDown,
    mouseUp,
    mouseMove,
    fillBackground,
    isDrawingFloor,
    isDrawingWall
  } = useFabricDraw(cellWidth.value)

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
    canvas.value.add(middleLayer.value)
    canvas.value.add(gridLayer.value)

    setBrush('Pencil')

    // Draw grid lines on the canvas
    const options = { stroke: '#000000', strokeWidth: 1 }
    for (let i = 1; i < canvas.value.getWidth() / cellWidth.value + 1; i++) {
      gridLayer.value.add(new fabric.Line([cellWidth.value * i, 0, cellWidth.value * i, 600], options))
      gridLayer.value.add(new fabric.Line([0, cellWidth.value * i, 600, cellWidth.value * i], options))
    }

    calculateCount()

    canvas.value.on({
      dragenter: () => { draggedOver.value = true },
      dragleave: () => { draggedOver.value = false },
      'object:added': e => calculateCount(e as { target: fabric.Object }),
      'object:removed': () => calculateCount(),
      'object:moving': ({ target }) => {
        if (useSnapToGrid.value) { snapToGrid(target, cellWidth.value) }
      },
      'selection:created': () => { spriteSelected.value = true },
      'selection:cleared': () => { spriteSelected.value = false },
      'mouse:down': ({ e }) => handleMouse(e, 'down'),
      'mouse:move': ({ e }) => handleMouse(e, 'move'),
      'mouse:up': ({ e }) => handleMouse(e, 'up')
    })

    // canvas.value.on('object:modified', e => handleBoundaries(e))
  }

  function handleMouse (e: fabric.TPointerEvent, action: 'move'|'down'|'up'): void {
    if (
      !selectedSprite.value ||
      !selectedType.value ||
      (selectedType.value !== 'floors' && selectedType.value !== 'walls') ||
      ((!isDrawingWall.value && !isDrawingFloor.value) && action === 'move')
    ) { return }

    const spriteData = getSprite(selectedType.value, selectedSprite.value)

    if (spriteData) {
      const layer: fabric.Group = selectedType.value === 'floors'
        ? floorLayer.value
        : middleLayer.value

      switch (action) {
        case 'down':
          mouseDown(e, canvas.value, layer, spriteData)
          break
        case 'move':
          mouseMove(e, canvas.value, layer, spriteData)
          break
        case 'up':
          mouseUp(canvas.value)
          break
      }
    }
  }

  function findType (sprite: Sprite): SpriteType | undefined {
    if (recentCategorySearch.value?.sprite === sprite) {
      return recentCategorySearch.value.category
    }

    for (const category in sprites) {
      const json = sprites as SpriteMap

      const categoryArray = json[category as keyof SpriteMap]
      const match = categoryArray.find(item => item.value === sprite)

      if (match) {
        recentCategorySearch.value = { sprite, category: category as SpriteType }

        return category as SpriteType
      }
    }
  }

  function calculateCount (event?: { target: fabric.Object }): void {
    let count: number = canvas.value?.getObjects().filter(obj => !(obj instanceof fabric.Group)).length || 0

    if (event && count > maxSprites.value) {
      canvas.value?.remove(event.target)
      canvas.value?.requestRenderAll()
      count--
      // use a toast for max amount of sprites
    }

    spriteAmount.value = count
  }

  function getSprite (type: SpriteType, sprite: Sprite): SpriteData | undefined {
    const spriteMeta = sprites[type].find(svg => svg.value === sprite) as SpriteMetaData<Sprite>

    if (!spriteMeta) { return }

    return {
      url: `${siteUrl}/art/${type}/${sprite}${spriteMeta?.variations ? '-1' : ''}.svg`,
      ...spriteMeta
    }
  }

  function setSprite (sprite: Sprite, type: SpriteType): void {
    selectedSprite.value = selectedSprite.value === sprite ? undefined : sprite
    selectedType.value = selectedSprite.value ? type : undefined

    toggleDrawing(false)
  }

  function setBackgroundImage (img: fabric.Image): void {
    canvas.value?.set({ backgroundImage: img })
    canvas.value?.requestRenderAll()
  }

  function add (object: fabric.Object): void {
    if (useSnapToGrid.value) {
      snapToGrid(object, cellWidth.value)
    }

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

  function toggleGridLines (): void {
    showGrid.value = !showGrid.value

    if (showGrid.value) {
      canvas.value?.add(gridLayer.value)
    } else {
      canvas.value?.remove(gridLayer.value)
    }

    canvas.value?.requestRenderAll()
  }

  function toggleDrawing (value?: boolean): void {
    isDrawingMode.value = value ?? !isDrawingMode.value
    canvas.value?.set('isDrawingMode', isDrawingMode.value)

    if (isDrawingMode.value) {
      selectedSprite.value = undefined
      selectedType.value = undefined
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
    // if (!canvas.value) {
    //   return
    // }

    // deze functie moet json naar fabric object casten maar werkt niet momenteel
    // fabric.util.enlivenObjects(items, (objects) => {
    //   const origRenderOnAddRemove = canvas.value!.renderOnAddRemove
    //   canvas.value!.renderOnAddRemove = false

    //   objects.forEach((object: fabric.Object) => {
    //     canvas.value!.add(object)
    //   })

    //   canvas.value!.renderOnAddRemove = origRenderOnAddRemove
    //   canvas.value!.requestRenderAll()
    // })
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
    selectedType,
    useSnapToGrid,
    showGrid,
    mount,
    getSprite,
    fillBackground,
    setBackgroundImage,
    add,
    remove,
    update,
    keydownHandler,
    toggleDrawing,
    setBrush,
    findType,
    setSprite,
    toggleGridLines
  }
}
