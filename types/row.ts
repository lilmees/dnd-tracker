type RowType = 'summon' | 'lair' | 'monster' | 'player' | 'npc'

type ActionType = 'actions' | 'legendary_actions' | 'reactions' | 'special_abilities'

type HPActionType = 'heal' | 'damage' | 'temp' | 'override' | 'override-reset'

type ACActionType = 'temp' | 'remove' | 'reset' | 'override' | 'override-reset'

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
  type?: ActionType
  attack_bonus?: number
  damage_bonus?: number
  damage_dice?: string
}

interface Condition {
  slug: string
  name: string
  id: string
  desc: string
  level?: number
  hasLevels?: boolean
}

interface Row extends Partial<PossibleAttacks> {
  ac?: number
  campaign?: number
  concentration: boolean
  conditions: Condition[]
  created_at: string
  deathSaves: DeathSaves
  health?: number
  id: string | number
  index: number
  initiative: number
  initiative_modifier?: number
  link?: string
  maxAc?: number
  maxHealth?: number
  maxAcOld?: number
  maxHealthOld?: number
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
