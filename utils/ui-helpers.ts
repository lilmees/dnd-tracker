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
