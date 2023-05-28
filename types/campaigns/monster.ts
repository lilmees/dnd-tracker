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
