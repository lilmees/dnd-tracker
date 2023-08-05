interface Profile extends Stripe {
  id: string
  created_at?: string
  username: string
  name: string
  role: string
  avatar?: string
  email: string
}

interface ProfileUpdate extends Partial<Omit<Profile, 'created_at' | 'id'>> {
  password?: string
}

interface ProfileUpdateForm extends ProfileUpdate {
  data: {
    error: string | null
  }
}

interface UpdatePasswordForm {
  password: string
  data: {
    error: string | null
  }
}
