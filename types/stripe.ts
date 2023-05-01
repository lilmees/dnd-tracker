interface Stripe {
  stripe_id?: string
  stripe_session_id?: string
  subscription_type?: string
  paid_subscription_active?: boolean
  stripe_status?: string
  stripe_trail_end_at?: string
  stripe_ends_at?: string
  stripe_started_at?: string
  stripe_last_event?: string
  stripe_trail_ends_at?: string
  subscription_id?: string | null
}
