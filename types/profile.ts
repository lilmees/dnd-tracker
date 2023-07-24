interface Profile extends Stripe {
  id: string
  created_at?: string
  username: string
  name: string
  role: string
  avatar?: string
  email: string
}

interface ProfileUpdate extends Partial<Omit<Profile, 'created_at' | 'id'>> {}
