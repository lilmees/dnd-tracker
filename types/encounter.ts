interface EncounterProfile {
  id: string
  name: string
  username: string
  avatar: string
}

type EncounterModal = 'name'|'initiative'|'ac'|'hp'|'link-action'|'ac-action'|'hp-action'|'condition-action'|'attack-action'

type TableSpacing = 'compact'|'normal'|'cozy'

interface EncounterSettings {
  spacing: TableSpacing
  rows: string[]
  modified: boolean
}

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
  info_cards: InfoCard[],
  settings: EncounterSettings
}

interface AddEncounter extends Omit<Encounter, 'id'|'created_at'|'profiles'|'info_cards'|'campaign'|'settings'> {
  campaign: undefined | number
}

interface UpdateEncounter extends Partial<Omit<Encounter, 'id'|'created_at'|'profiles'>> {
  campaign?: number
}

interface EncounterForm {
  title: string
  campaign?: number
  background: string
}
