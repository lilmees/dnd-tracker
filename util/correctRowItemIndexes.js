export const correctRowItemIndexes = encounters => {
  const indexes = [...new Set(encounters.map(e => e.index))].sort((a, b) => b.index - a.index)
  const corrected = []
  indexes.forEach(i => {
    const filtered = encounters.filter(e => e.index === i).sort((a, b) => b.initiative - a.initiative)
    filtered.forEach(f => corrected.push({ ...f, index: corrected.length }))
  })
  return corrected
}
