export const correctRowItemIndexes = (encounters) => {
  const rows = encounters.sort((a, b) => a.index - b.index)
  const indexes = [...new Set(rows.map(e => e.index))].sort((a, b) => b.index - a.index)
  const corrected = []
  indexes.forEach((i) => {
    const filtered = rows.filter(e => e.index === i).sort((a, b) => b.initiative - a.initiative)
    filtered.forEach(f => corrected.push({ ...f, index: corrected.length }))
  })
  return corrected
}
