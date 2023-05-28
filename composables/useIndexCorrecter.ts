export const useIndexCorrecter = (encounterRows: Row[]): Row[] => {
  const rows = encounterRows.sort((a, b) => a.index - b.index)
  const indexes = [...new Set(rows.map(e => e.index))].sort((a, b) => a - b)
  const corrected: Row[] = []
  indexes.forEach((i) => {
    const filtered = rows.filter(e => e.index === i)
      .sort((a: Row, b: Row) => b.initiative - a.initiative)
    filtered.forEach(f => corrected.push({ ...f, index: corrected.length }))
  })
  return corrected
}
