import * as fabric from 'fabric'
import sprites from '@/fixtures/sprites.json'
import {
  snapToGrid,
  setViewPortTransformWithinBounds
} from '@/utils/fabric-utils'

export const useMapBuilder = () => {
  const siteUrl = process.env.NODE_ENV === 'production' ? 'https://dnd-tracker.com' : 'http://localhost:3000'

  const toast = useToastStore()
  const { t } = useI18n()

  const canvas = ref<fabric.Canvas>()
  const floorLayer = ref<fabric.Group>(new fabric.Group([], { selectable: false }))
  const middleLayer = ref<fabric.Group>(new fabric.Group([], { selectable: false }))
  const gridLayer = ref<fabric.Group>(new fabric.Group([], { selectable: false }))
  const tooltip = ref<AOETooltip>()

  const cellWidth = ref<number>(32)
  const isDrawingMode = ref<boolean>(false)
  const activeBrush = ref<FabricBrush>('Pencil')
  const activeColor = ref<string>('#000000')
  const brushSize = ref<string>('32')
  const draggedOver = ref<boolean>(false)
  const maxSprites = ref<number>(200)
  const spriteAmount = ref<number>(0)
  const spriteSelected = ref<boolean>(false)
  const showGrid = ref<boolean>(true)
  const useSnapToGrid = ref<boolean>(false)
  const selectedSprite = ref<Sprite>()
  const selectedType = ref<SpriteType>()
  const recentCategorySearch = ref<{ sprite: Sprite, category: SpriteType }>()
  const isPanning = ref<boolean>(false)
  const lastPosX = ref<number>()
  const lastPosY = ref<number>()
  const zoom = ref<number>(1)

  const {
    mouseDown,
    mouseUp,
    mouseMove,
    fillBackground,
    isDrawingFloor,
    isDrawingWall
  } = useFabricDraw(cellWidth.value)

  function mount (element: HTMLCanvasElement): void {
    canvas.value = markRaw(new fabric.Canvas(element))

    if (canvas.value) {
      setCanvasValues()
    }
  }

  function resetCanvas (): void {
    if (canvas.value) {
      lastPosX.value = undefined
      lastPosY.value = undefined
      floorLayer.value.removeAll()
      middleLayer.value.removeAll()
      canvas.value.clear()
      setCanvasValues()
    }
  }

  function setCanvasValues (): void {
    if (!canvas.value) { return }

    canvas.value?.set({
      backgroundColor: '#21252EB3',
      isDrawingMode: isDrawingMode.value
    })

    window.addEventListener('keydown', keydownHandler)

    canvas.value.add(floorLayer.value)
    canvas.value.add(middleLayer.value)
    canvas.value.add(gridLayer.value)

    setBrush('Pencil')

    // Draw grid lines on the canvas
    const options = { stroke: '#000000', strokeWidth: 1 }
    for (let i = 1; i < canvas.value.getWidth() / cellWidth.value + 1; i++) {
      gridLayer.value.add(new fabric.Line([cellWidth.value * i, 0, cellWidth.value * i, 512], options))
      gridLayer.value.add(new fabric.Line([0, cellWidth.value * i, 512, cellWidth.value * i], options))
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
      'object:modified': ({ target }) => handleBoundaries(target),
      'selection:created': () => { spriteSelected.value = true },
      'selection:cleared': () => { spriteSelected.value = false },
      'mouse:down': ({ e }) => handleMouse(e, 'down'),
      'mouse:move': ({ e, target }) => {
        handleTooltip(target, e)
        handleMouse(e, 'move')
      },
      'mouse:up': ({ e }) => handleMouse(e, 'up'),
      'mouse:wheel': ({ e }) => handleMouseWheel(e)
    })
  }

  function handleTooltip (target: fabric.Object, e: fabric.TPointerEvent): void {
    if (!canvas.value || !target) { return }

    if (
      !(target instanceof fabric.Group) &&
      e instanceof MouseEvent &&
      target.aoe
    ) {
      tooltip.value = {
        aoe: target.aoe,
        hidden: false,
        left: `${e.clientX + 25}px`,
        top: `${e.clientY - 200}px`
      }
    } else {
      tooltip.value = { hidden: true }
    }
  }

  function handleMouse (e: fabric.TPointerEvent, action: 'move'|'down'|'up'): void {
    const { altKey, shiftKey, ctrlKey, metaKey } = e

    if (canvas.value && (altKey || shiftKey || ctrlKey || metaKey)) {
      handlePanning(e as MouseEvent, action)
      return
    }

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

  function handleMouseWheel (e: WheelEvent): void {
    if (!canvas.value) { return }

    let currentZoom = canvas.value.getZoom()
    const width = canvas.value.getWidth()
    const height = canvas.value.getHeight()
    const vpt = canvas.value!.viewportTransform

    // Makes zoom smoother
    currentZoom *= 0.999 ** e.deltaY
    currentZoom = Math.max(1, Math.min(currentZoom, 10))

    canvas.value.zoomToPoint(
      new fabric.Point({ x: e.offsetX, y: e.offsetY }),
      currentZoom
    )

    zoom.value = currentZoom

    e.preventDefault()
    e.stopPropagation()

    setViewPortTransformWithinBounds(vpt, currentZoom, width, height)
  }

  function handlePanning (e: MouseEvent, action: 'move'|'down'|'up'): void {
    switch (action) {
      case 'down':
        isPanning.value = true
        lastPosX.value = e.clientX
        lastPosY.value = e.clientY
        break
      case 'move':
        if (isPanning.value) {
          const currentZoom = canvas.value!.getZoom()
          const width = canvas.value!.getWidth()
          const height = canvas.value!.getHeight()
          const vpt = canvas.value!.viewportTransform

          setViewPortTransformWithinBounds(vpt, currentZoom, width, height, () => {
            vpt[4] += e.clientX - (lastPosX.value ?? 0)
            vpt[5] += e.clientY - (lastPosY.value ?? 0)
          })

          canvas.value!.requestRenderAll()

          zoom.value = currentZoom
          lastPosX.value = e.clientX
          lastPosY.value = e.clientY
        }
        break
      case 'up':
        canvas.value!.setViewportTransform(canvas.value!.viewportTransform)

        isPanning.value = false
        break
    }
  }

  function changeZoom (out: boolean): void {
    const currentZoom = Math.max(1, Math.min(out ? zoom.value - 1 : zoom.value + 1))

    canvas.value?.setZoom(currentZoom)
    zoom.value = currentZoom
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

      toast.warn({
        title: t('pages.map.toast.max.title'),
        text: t('pages.map.toast.max.text')
      })
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

  function handleBoundaries (target: fabric.Image): void {
    if (!canvas.value) { return }

    const width = canvas.value.getWidth()
    const height = canvas.value.getHeight()
    const boundingBox = target.getBoundingRect()

    if (boundingBox.left < 0) {
      target.set({ left: 0 })
    } else if (boundingBox.left + boundingBox.width > width) {
      target.set({ left: width - boundingBox.width })
    }

    if (boundingBox.top < 0) {
      target.set({ top: 0 })
    } else if (boundingBox.top + boundingBox.height > height) {
      target.set({ top: height - boundingBox.height })
    }

    target.setCoords()
    canvas.value.requestRenderAll()
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

  function deserializeCanvas (items: fabric.Object[]): void {}

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
    cellWidth,
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
    zoom,
    tooltip,
    mount,
    resetCanvas,
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
    toggleGridLines,
    changeZoom
  }
}
