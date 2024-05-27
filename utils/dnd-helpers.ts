export function initiativeModifierFromDEX(dex: number, min: number = 0): number {
  return Math.max(min, Math.floor((dex - 10) / 2))
}
