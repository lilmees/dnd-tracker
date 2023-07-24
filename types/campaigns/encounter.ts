interface Encounter {
  id: number
  created_at: string
  created_by: string
  title: string
  rows: Row[]
  profiles: EncounterProfile
  campaign: number | Campaign
  admins: string[]
  round: number
  owner?: string
  info?: string
  activeIndex: number
  color: string
  background: string
  info_cards: InfoCard[]
}
