export const onGenerateOppositeColor = (colors) => {
  const textColors = []

  colors.forEach((hex) => {
    if (hex.indexOf('#') === 0) hex = hex.slice(1)
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    if (hex.length < 6) hex.padEnd(6, '0')

    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)

    textColors.push(r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF')
  })

  if (textColors.length === 1) { return textColors[0] }
  else {
    // calculate most contrasting color when there are more colors than one
    const hashmap = textColors.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1
      return acc
    }, {})
    return Object.keys(hashmap).reduce((a, b) => hashmap[a] > hashmap[b] ? a : b)
  }
}
