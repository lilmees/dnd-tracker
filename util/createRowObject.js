import { calculateRowIndex } from '@/util/calculateRowIndex'

export const createRowObject = (formData, type, encounters) => {
  const initiative = Number(formData.initiative) || null
  const health = Number(formData.health) || null
  const ac = Number(formData.ac) || null

  const index = calculateRowIndex(encounters, initiative)
  const id = () => Date.now() + Math.floor(Math.random() * 100)

  let row = { ...formData, id, conditions: [], curses: [], type, index, initiative }

  if (type !== 'lair') {
    row = { ...row, health, ac, maxHealth: form.health, maxAc: form.ac, tempHealth: 0, tempAc: 0, concentration: false }
  }

  if (type !== 'lair' && type !== 'summon') {
    row = { ...row, deathSaves: { save: [false, false, false], fail: [false, false, false] } }
  }

  return row
}
