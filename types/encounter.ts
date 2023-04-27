interface Encounter {
  id: number
  created_at: string
  name: string
  rows: string | { [key: string]: any }
  campaign: number | Campaign
  round: number
  owner: string
  info?: string
}
