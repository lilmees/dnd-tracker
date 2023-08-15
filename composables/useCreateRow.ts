export const useCreateRow = (formData: Row, type: RowType, encounterRows: Row[]): Row => {
  const initiative = Number(formData.initiative) || null
  const health = Number(formData.health || formData.hit_points) || null
  const ac = Number(formData.ac || formData.armor_class) || null

  const index = useCalculateIndex(encounterRows, initiative)
  const id = Date.now() + Math.floor(Math.random() * 100)

  let row = { ...formData, id, conditions: [], type, index, initiative: initiative || -1, note: '' }

  if (type !== 'lair') {
    row = {
      ...row,
      health: health as number,
      ac: ac as number,
      maxHealth: health as number,
      maxAc: ac as number,
      tempHealth: 0,
      tempAc: 0,
      concentration: false
    }
  }

  if (type !== 'lair' && type !== 'summon') {
    row = {
      ...row,
      deathSaves: {
        save: [false, false, false],
        fail: [false, false, false],
        stable: false
      }
    }
  }

  return row
}
