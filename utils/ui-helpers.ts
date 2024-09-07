export function generateId(): string {
  return Math.random().toString(36).substring(2, 16)
}

export const calculateLines = (tag: HTMLParagraphElement, text: string): number => {
  const tempDiv = document.createElement('div')

  // Add styling and content to the paragraph
  tempDiv.style.width = tag.offsetWidth + 'px'
  tempDiv.style.font = window.getComputedStyle(tag).font
  tempDiv.innerText = text

  document.body.appendChild(tempDiv)

  const height = tempDiv.clientHeight

  document.body.removeChild(tempDiv)

  const lineHeight = parseFloat(window.getComputedStyle(tag).lineHeight)

  return height / lineHeight
}

export function calculateSliderOverflow(width: number): number {
  let margin = 0
  let minMargin = 16

  if (width < 768) {
    margin = width - 768
    minMargin = 16
  }
  else if (width < 1024) {
    margin = width - 1024
    minMargin = 32
  }
  else if (width < 1280) {
    margin = width - 1280
    minMargin = 48
  }
  else if (width < 1440) {
    margin = width - 1440
    minMargin = 48
  }
  else {
    margin = width - 1920
    minMargin = 64
  }

  return margin <= 0 ? minMargin : Math.round(margin / 2) + minMargin
}
