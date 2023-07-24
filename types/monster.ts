interface Abilities {
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
}

interface PossibleAttacks {
  actions: Action[]
  legendary_actions: Action[]
  reactions: Action[]
  special_abilities: Action[]
}

interface Monster extends PossibleAttacks, Abilities {
  name: string
  challenge_rating?: number
  armor_class?: number
  hit_points?: number
  type: string
  subtype: string
  size: string
  alignment: string
  xp: string
}
