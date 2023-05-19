interface EncounterSchemaOptions {
  isLoading: boolean
  campaign: boolean
  update: boolean
  error: null | string
  options?: Option[]
  changeColor?: () => void
}
