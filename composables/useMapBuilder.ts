import * as fabric from 'fabric'
import sprites from '@/constants/sprites.json'

export const useMapBuilder = () => {
  const toast = useToastStore()
  const { t } = useI18n()

  const canvas = ref<fabric.Canvas>()
  const floorLayer = ref<fabric.Group>(new fabric.Group([], { selectable: false }))
  const middleLayer = ref<fabric.Group>(new fabric.Group([], { selectable: false }))
  const gridLayer = ref<fabric.Group>(new fabric.Group([], { selectable: false }))
  const tooltip = ref<AOETooltip>()

  const cellWidth = ref<number>(32)
  const isDrawingMode = ref<boolean>(false)
  const draggedOver = ref<boolean>(false)
  const maxSprites = ref<number>(200)
  const spriteAmount = ref<number>(0)
  const spriteSelected = ref<boolean>(false)
  const showGrid = ref<boolean>(true)
  const useSnapToGrid = ref<boolean>(false)
  const selectedSprite = ref<Sprite>()
  const selectedType = ref<SpriteType>()
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
    isDrawingWall,
  } = useFabricDraw(cellWidth.value)

  function mount(element: HTMLCanvasElement): void {
    canvas.value = markRaw(new fabric.Canvas(element))

    if (canvas.value) {
      setCanvasValues()
    }
  }

  function resetCanvas(): void {
    if (canvas.value) {
      lastPosX.value = undefined
      lastPosY.value = undefined
      floorLayer.value.removeAll()
      middleLayer.value.removeAll()
      canvas.value.clear()
      setCanvasValues()
    }
  }

  function setCanvasValues(): void {
    if (!canvas.value) {
      return
    }

    window.addEventListener('keydown', keydownHandler)

    set('backgroundColor', '#21252EB3')
    addLayers()
    drawGridLines(canvas.value, cellWidth.value, gridLayer.value as fabric.Group)
    calculateCount()
    setCanvasHooks()
  }

  function setCanvasHooks(): void {
    if (!canvas.value) {
      return
    }

    canvas.value.on({
      'dragenter': () => { draggedOver.value = true },
      'dragleave': () => { draggedOver.value = false },
      'object:added': ({ target }: { target: fabric.Object }) => {
        if (target) {
          calculateCount(target)
        }
      },
      'object:removed': () => calculateCount(),
      'object:moving': ({ target }) => {
        if (useSnapToGrid.value) {
          snapToGrid(target, cellWidth.value)
        }
      },
      'object:modified': ({ target }) => {
        if (target) {
          handleBoundaries(canvas.value, target)
        }
      },
      'selection:created': () => { spriteSelected.value = true },
      'selection:cleared': () => { spriteSelected.value = false },
      'mouse:down': ({ e }) => handleMouse(e, 'down'),
      'mouse:move': ({ e, target }: { e: MouseEvent, target: fabric.Object }) => {
        if (target) {
          handleTooltip(target, e)
        }
        handleMouse(e, 'move')
      },
      'mouse:up': ({ e }) => handleMouse(e, 'up'),
      'mouse:wheel': ({ e }) => handleMouseWheel(e as WheelEvent),
    })
  }

  function addLayers(): void {
    if (!canvas.value) {
      return
    }

    if (floorLayer.value instanceof fabric.Group) {
      canvas.value.add(floorLayer.value)
    }

    if (middleLayer.value instanceof fabric.Group) {
      canvas.value.add(middleLayer.value)
    }

    if (gridLayer.value instanceof fabric.Group) {
      canvas.value.add(gridLayer.value)
    }
  }

  function handleTooltip(
    target: fabric.Object & { aoe?: AOE },
    e: fabric.TPointerEvent,
  ): void {
    if (!canvas.value || !target) {
      return
    }

    if (
      !(target instanceof fabric.Group)
      && e instanceof MouseEvent
      && target.aoe
    ) {
      tooltip.value = {
        aoe: target.aoe,
        hidden: false,
        left: `${e.clientX + 25}px`,
        top: `${e.clientY - 200}px`,
      }
    }
    else {
      tooltip.value = { hidden: true }
    }
  }

  function handleMouse(e: fabric.TPointerEvent, action: 'move' | 'down' | 'up'): void {
    const { shiftKey } = e

    if (canvas.value && shiftKey) {
      handlePanning(e as MouseEvent, action)
      return
    }

    if (
      !selectedSprite.value
      || !selectedType.value
      || (selectedType.value !== 'floors' && selectedType.value !== 'walls')
      || ((!isDrawingWall.value && !isDrawingFloor.value) && action === 'move')
    ) { return }

    const spriteData = getSprite(selectedType.value, selectedSprite.value)

    if (spriteData) {
      const layer = selectedType.value === 'floors'
        ? floorLayer.value as fabric.Group
        : middleLayer.value as fabric.Group

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

  function handleMouseWheel(e: WheelEvent): void {
    if (!canvas.value) {
      return
    }

    let currentZoom = canvas.value.getZoom()
    const width = canvas.value.getWidth()
    const height = canvas.value.getHeight()
    const vpt = canvas.value!.viewportTransform

    // Makes zoom smoother
    currentZoom *= 0.999 ** e.deltaY
    currentZoom = Math.max(1, Math.min(currentZoom, 10))

    canvas.value.zoomToPoint(
      new fabric.Point({ x: e.offsetX, y: e.offsetY }),
      currentZoom,
    )

    zoom.value = currentZoom

    e.preventDefault()
    e.stopPropagation()

    setViewPortTransformWithinBounds(vpt, currentZoom, width, height)
  }

  function handlePanning(e: MouseEvent, action: 'move' | 'down' | 'up'): void {
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

  function changeZoom(out: boolean): void {
    const currentZoom = calculateZoom(out, zoom.value)

    canvas.value?.setZoom(currentZoom)
    zoom.value = currentZoom
  }

  function calculateCount(target?: fabric.Object): void {
    let count: number = canvas.value?.getObjects().filter(obj => !(obj instanceof fabric.Group)).length || 0

    if (target && count > maxSprites.value) {
      canvas.value?.remove(target)
      canvas.value?.requestRenderAll()
      count--

      toast.warn({
        title: t('pages.map.toast.max.title'),
        text: t('pages.map.toast.max.text'),
      })
    }

    spriteAmount.value = count
  }

  function setSprite(sprite: Sprite, type: SpriteType): void {
    selectedSprite.value = selectedSprite.value === sprite ? undefined : sprite
    selectedType.value = selectedSprite.value ? type : undefined
  }

  function set(key: string, value: any): void {
    canvas.value?.set(key, value)
    canvas.value?.requestRenderAll()
  }

  function add(object: fabric.Object): void {
    if (useSnapToGrid.value) {
      snapToGrid(object, cellWidth.value)
    }

    canvas.value?.add(object)
    canvas.value?.requestRenderAll()
  }

  function update(object: fabric.Object, key: string, value: any): void {
    object.set(key, value)

    if (useSnapToGrid.value && (key === 'left' || key === 'top')) {
      snapToGrid(object, cellWidth.value)
    }

    object.setCoords()
    canvas.value?.requestRenderAll()
  }

  function remove(): void {
    canvas.value?.remove(...canvas.value.getActiveObjects())
    canvas.value?.discardActiveObject()
    canvas.value?.requestRenderAll()
  }

  function keydownHandler(e: KeyboardEvent): void {
    const object: fabric.Object | undefined = canvas.value?.getActiveObject()
    const step = useSnapToGrid.value ? cellWidth.value : 8

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

  function toggleGridLines(): void {
    showGrid.value = !showGrid.value

    if (canvas.value && gridLayer.value instanceof fabric.Group) {
      showGrid.value
        ? canvas.value.add(gridLayer.value)
        : canvas.value.remove(gridLayer.value)

      canvas.value.requestRenderAll()
    }
  }

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
    spriteSelected,
    selectedSprite,
    selectedType,
    useSnapToGrid,
    showGrid,
    zoom,
    tooltip,
    mount,
    resetCanvas,
    fillBackground,
    set,
    add,
    remove,
    update,
    keydownHandler,
    setSprite,
    toggleGridLines,
    changeZoom,
  }
}
