interface Profile extends Stripe {
  id: string
  created_at?: string
  username: string
  name: string
  role: string
  avatar?: string
  email: string
  marketing: boolean
  badges: EarnedBadge[]
}

interface ProfileUpdate extends Partial<Omit<Profile, 'created_at' | 'id'>> {
  password?: string
}

interface SocialProfile extends Required<Omit<Profile, StripeFields|'marketing'|'role'>> {}
