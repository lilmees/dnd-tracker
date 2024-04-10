interface EncounterProfile {
  id: string
  name: string
  username: string
  avatar: string
}

type TableSpacing = 'compact' | 'normal' | 'cozy'

type EncounterModal = 'name' | 'initiative' | 'ac' | 'hp' | 'link-modal' | 'ac-modal' | 'hp-modal' | 'condition-modal' | 'possible-attacks-modal'

type EncounterUpdateField = 'name' | 'initiative' | 'ac' | 'health' | 'link' | 'note' | 'concentration' | 'deathSaves' | 'note' | 'conditions'

type EncounterPet = 'cat' | 'chicken' | 'barmaid' | 'crawler' | 'dragon' | 'fairy' | 'redcap' | 'wolf-rider'

interface EncounterSettings {
  spacing: TableSpacing
  rows: string[]
  widgets: string[]
  modified: boolean
  pet: EncounterPet | undefined
}

interface Encounter {
  id: number
  created_at: string
  created_by: string
  title: string
  rows: Row[]
  profiles?: EncounterProfile
  campaign?: Campaign
  round: number
  owner?: string
  info?: string
  activeIndex: number
  info_cards: InfoCard[],
  settings: EncounterSettings
}

interface AddEncounter extends Omit<Encounter, 'id'|'created_at'|'profiles'|'info_cards'|'campaign'|'settings'> {
  campaign: undefined | number
}

interface UpdateEncounter extends Partial<Omit<Encounter, 'id'|'created_at'|'profiles'|'campaign'>> {
  campaign?: number
}

interface EncounterForm {
  title: string
  campaign?: number
}

interface SortedCampaignEncounter {
  [key: string]: {
    encounters: Encounter[]
    campaign?: Campaign
    created_by?: string
  }
}
