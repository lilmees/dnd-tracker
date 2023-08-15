interface AddInitiativeForm {
  name: string,
  type: RowType | null
  initiative: number | null
  ac: number | null
  health: number | null
  link: string | null
  amount: number | null
  summoner: Summoner | null | number
  data?: HomebrewSchemaOptions
}
