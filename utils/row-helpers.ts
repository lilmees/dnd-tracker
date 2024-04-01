export function hasDeathSaves (type: RowType): boolean {
  return !['summon', 'lair'].includes(type)
}
