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
  type: string
  armor_class?: string
  hit_points?: string
  summoner?: Summoner
}
