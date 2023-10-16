export function calculateSliderOverflow (width: number): number {
  let margin = 0
  let minMargin = 16

  if (width < 768) {
    margin = width - 768
    minMargin = 16
  } else if (width < 1024) {
    margin = width - 1024
    minMargin = 32
  } else if (width < 1280) {
    margin = width - 1280
    minMargin = 48
  } else if (width < 1440) {
    margin = width - 1440
    minMargin = 48
  } else {
    margin = width - 1920
    minMargin = 64
  }

  return margin <= 0 ? minMargin : Math.round(margin / 2) + minMargin
}
