export function randomColor (): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`.padEnd(7, 'e')
}

export function contrastColor (hex: string): string {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1)
  }
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }
  if (hex.length < 6) {
    hex.padEnd(6, '0')
  }

  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)

  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF'
}

export function rgbToHex (r: number, g: number, b: number): string {
  return ('#' +
  Math.min(Math.max(r, 0), 255).toString(16).padStart(2, '0') +
  Math.min(Math.max(g, 0), 255).toString(16).padStart(2, '0') +
  Math.min(Math.max(b, 0), 255).toString(16).padStart(2, '0')
  )
}

export function hexToRgb (hex: string): RGB {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  return { r, g, b }
}
