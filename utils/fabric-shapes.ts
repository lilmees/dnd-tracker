import * as fabric from 'fabric'

const options = {
  fill: 'transparent',
  strokeDashArray: [5, 5],
  lockScalingX: true,
  lockScalingY: true
}

function transformFT (number: number, grid: number): number {
  return (number / 5) * grid
}

export function createRectangle (width: number, height: number, grid: number): fabric.Rect {
  return new fabric.Rect({
    width: transformFT(+width, grid),
    height: transformFT(+height, grid),
    aoe: {
      width: +width,
      height: +height
    },
    stroke: '#F87272',
    ...options
  })
}

export function createCube (width: number, grid: number): fabric.Rect {
  return new fabric.Rect({
    width: transformFT(+width, grid),
    height: transformFT(+width, grid),
    aoe: {
      width: +width,
      height: +width
    },
    stroke: '#1FB2A5',
    ...options
  })
}

export function createCone (width: number, height: number, grid: number): fabric.Polygon {
  const points = clipPathToPolygon(
    '0% 15%, 50% 100%, 100% 15%, 80% 5%, 50% 0%, 20% 5%',
    transformFT(+width, grid),
    transformFT(+height, grid)
  )

  return new fabric.Polygon(points, {
    width: transformFT(+width, grid),
    height: transformFT(+height, grid),
    aoe: {
      width: +width,
      height: +height
    },
    stroke: '#FBBD23',
    ...options
  })
}

export function createLine (height: number, grid: number): fabric.Rect {
  return new fabric.Rect({
    width: +grid,
    height: transformFT(+height, grid),
    aoe: {
      width: 5,
      height: +height
    },
    stroke: '#3ABFF8',
    ...options
  })
}

export function createSphere (radius: number, grid: number): fabric.Circle {
  return new fabric.Circle({
    radius: transformFT(+radius, grid),
    aoe: {
      radius: +radius
    },
    stroke: '#36D399',
    ...options
  })
}

export function getShapeIcon (shape: string): string {
  switch (shape) {
    case 'Rectangle':
      return 'material-symbols:rectangle-outline'
    case 'Cube':
      return 'material-symbols:square-outline'
    case 'Cone':
      return 'tabler:cone-2'
    case 'Line':
      return 'ci:line-xl'
    default:
      return 'material-symbols:lens-outline'
  }
}

export function getShapeColor (shape: string): string {
  switch (shape) {
    case 'Rectangle':
      return 'text-danger'
    case 'Cube':
      return 'text-help'
    case 'Cone':
      return 'text-warning'
    case 'Line':
      return 'text-info'
    default:
      return 'text-success'
  }
}
