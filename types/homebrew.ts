interface Homebrew {
  id: number
  created_at: string
  campaign: number
  name: string
  ac?: number
  health?: number
  link?: string
  type: RowType
}

interface AddHomebrew extends Required<Omit<Homebrew, 'id'|'created_at'>> {}

interface UpdateHomebrew extends Partial<Omit<Homebrew, 'id' | 'created_at'>> {}

interface HomebrewSchemaOptions {
  isLoading: boolean
  update: boolean
  error: null | string
  encounter: boolean
  options?: Option[]
  summoners?: Option[]
  rollDice?: () => void
}

interface AddHomebrewForm {
  name: string
  link: string | null
  type: RowType
  data: HomebrewSchemaOptions
}

interface UpdateHomebrewForm {
  name: string
  link: string | null
  type: RowType
  data: HomebrewSchemaOptions
}