interface Note {
  id: number
  created_at: string
  campaign: number
  title: string
  text: string
}

type UserRole = 'Owner' | 'Admin' | 'Viewer'

interface TeamMember {
  id: number
  role: UserRole
  user: SocialProfile
  campaign: string
}

interface JoinCampaign {
  id: number
  created_at: string
  campaign: number
  role: UserRole
  token: string
  user: SocialProfile
}

interface Campaign {
  id: number
  created_at: string
  created_by: SocialProfile
  homebrew_items?: Homebrew[]
  initiative_sheets?: Encounter[]
  notes?: Note[]
  title: string
  team?: TeamMember[]
  join_campaign?: JoinCampaign[]
}

interface AddCampaign extends Pick<Campaign, 'title'> {
  created_by: string
}

interface UpdateCampaign extends Partial<Omit<Campaign, 'id'|'created_at'|'created_by'|'initiative_sheets'>> {
  created_by?: string
}

interface CampaignForm extends Pick<Campaign, 'title'> {}

type CampaignPageType = 'content'|'settings'|'danger-zone'|'join'

interface CreateJoinCampaign extends Omit<JoinCampaign, 'id'|'created_at'|'user'> {
  user: string
}

interface CheckJoinCampaign extends Omit<JoinCampaign, 'campaign'> {
  campaign: {
    title: string,
    id: string
  }
}

interface AddTeamMember extends Omit<TeamMember, 'id'|'user'> {
  user: string
}

interface UpdateTeamMember extends Pick<TeamMember, 'role'> {}
