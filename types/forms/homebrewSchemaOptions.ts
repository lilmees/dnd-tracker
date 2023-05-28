interface HomebrewSchemaOptions {
  isLoading: boolean
  update: boolean
  error: null | string
  encounter: boolean
  options?: Option[]
  summoners?: Option[]
  rollDice?: () => void
}
