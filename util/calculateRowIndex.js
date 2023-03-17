export const calculateRowIndex = (encounters, initiative) => {
  const rows = encounters

  if (initiative === null) return rows.length
  const initiatives = rows.map(e => e.initiative).sort((a, b) => b.index - a.index)

  // put item in beginning of array if its bigger than highest initiative
  if (initiatives[0] < initiative) return 0

  // if there is already an encounter with the same initiative, then put it behind it's index
  if (initiatives.includes(initiative)) {
    return rows.filter(e => e.initiative === initiative).sort((a, b) => b.index - a.index)[0].index + 1
  }

  // check where the encounter index should be placed in the array
  const index = initiatives.findIndex(i => i < initiative)
  return index === -1 ? initiatives.length - 1 : index - 1
}
