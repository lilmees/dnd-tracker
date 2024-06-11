export const useCreateRow = (formData: Row, type: RowType, encounterRows: Row[]): Row => {
  const initiative = Number(formData.initiative) || null
  const health = Number(formData.health || formData.hit_points) || null
  const ac = Number(formData.ac || formData.armor_class) || null
  const initiative_modifier = Number(formData.initiative_modifier) || undefined

  const index = useCalculateIndex(encounterRows, initiative)
  const id = Date.now() + Math.floor(Math.random() * 100)

  let row = {
    ...formData,
    id,
    conditions: [],
    type,
    index,
    initiative: initiative || -1,
    initiative_modifier,
    note: '',
  }

  if (type !== 'lair') {
    row = {
      ...row,
      health: health as number,
      ac: ac as number,
      maxHealth: health as number,
      maxAc: ac as number,
      tempHealth: 0,
      tempAc: 0,
      concentration: false,
    }
  }

  if (type !== 'lair' && type !== 'summon') {
    row = {
      ...row,
      deathSaves: {
        save: [false, false, false],
        fail: [false, false, false],
        stable: false,
      },
    }
  }

  sanitizeRow(row)

  return row
}

function sanitizeRow(row: Row): void {
  const keys: string[] = [
    'ac',
    'campaign',
    'concentration',
    'conditions',
    'created_at',
    'deathSaves',
    'health',
    'id',
    'index',
    'initiative',
    'initiative_modifier',
    'link',
    'maxAc',
    'maxHealth',
    'maxAcOld',
    'maxHealthOld',
    'name',
    'note',
    'tempAc',
    'tempHealth',
    'type',
    'summoner',
    'actions',
    'legendary_actions',
    'reactions',
    'special_abilities',
  ]

  for (const key in row) {
    if (!keys.includes(key)) {
      delete row[key as keyof Row]
    }
  }
}
