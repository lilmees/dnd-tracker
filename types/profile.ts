interface Profile extends Stripe {
  id: string
  created_at?: string
  username: string
  name: string
  role: string
  avatar?: string
  email: string
}
