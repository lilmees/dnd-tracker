interface Note {
  id: number
  created_at: string
  campaign: number
  title: string
  text: string
}

interface Campaign {
  id: number
  created_at: string
  created_by: string
  admins: string[]
  homebrew_items?: Homebrew[]
  initiative_sheets?: Encounter[]
  notes?: Note[]
  title: string
  background: string
  color: string
}

interface AddCampaign extends Pick<Campaign, 'created_by'|'admins'|'title'|'background'|'color'> {}

interface UpdateCampaign extends Partial<Omit<Campaign, 'id'|'created_at'|'created_by'|'initiative_sheets'>> {}

interface AddCampaignForm extends Pick<Campaign, 'title'|'background'> {}
