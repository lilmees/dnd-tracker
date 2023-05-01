interface Encounter {
  id: number
  created_at: string
  created_by: string
  name: string
  rows: string | Row[]
  campaign: number | Campaign
  admins: string[]
  round: number
  owner: string
  info?: string
  activeIndex: number
}
