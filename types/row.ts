type RowType = 'summon' | 'lair' | 'monster' | 'player' | 'npc'

interface DeathSaves {
  save: boolean[]
  fail: boolean[]
  stable: boolean
}

interface Summoner {
  id: number
  name: string
}

interface Action {
  name: string
  desc: string
}

interface Condition {
  slug: string
  name: string
  id: string
  desc: string
}

interface Row {
  ac?: number
  campaign?: number
  concentration: boolean
  conditions: Condition[]
  actions: Action[]
  created_at: string
  deathSaves: DeathSaves,
  health?: number
  id: string | number
  index: number
  initiative: number
  link?: string
  maxAc?: number
  maxHealth?: number
  name: string
  note?: string
  tempAc?: number
  tempHealth?: number
  type: RowType
  armor_class?: string
  hit_points?: string
  summoner?: Summoner
}

interface RowUpdate extends Partial<Omit<Row, 'created_at' | 'id'>> {
  type: RowType
}
