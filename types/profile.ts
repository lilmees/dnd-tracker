interface Profile {
  id: string
  created_at?: string
  username: string
  name: string
  role: string
  avatar?: string
  email: string
  stripe_id?: string
  stripe_session_id?: string
  subscription_type: string
  paid_subscription_active: boolean
  subscription_id?: string
  stripe_status?: string
  stripe_trail_end_at?: string
  stripe_end_at?: string
  stripe_started_at?: string
  stripe_last_event?: string
}
