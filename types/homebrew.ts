interface Homebrew extends PossibleAttacks {
  id: number
  created_at: string
  campaign: number
  name: string
  player?: string
  ac?: number
  health?: number
  link?: string
  type: RowType
  initiative_modifier?: number
}

interface AddHomebrew extends Required<Omit<Homebrew, 'id' | 'created_at'>> {}

interface UpdateHomebrew extends Partial<Omit<Homebrew, 'id' | 'created_at'>> {}

interface HomebrewForm {
  name: string
  player?: string
  link: string | null
  type: RowType
  actions: Action[]
  ac?: number | undefined
  health?: number | undefined
  initiative?: number | undefined
  initiative_modifier?: number | undefined
  amount?: number | undefined
  summoner?: Summoner | undefined | number
  save?: boolean
}

type HomebrewModal = 'possible-attacks-modal' | 'homebrew-model'
