export function isPro (profile: Profile): boolean {
  return profile.subscription_type === 'pro'
}

export function isMedior (profile: Profile): boolean {
  return profile.subscription_type === 'pro' || profile.subscription_type === 'medior'
}

export function hasCorrectSubscription (subscription: StripeSubscriptionType, expected: StripeSubscriptionType): boolean {
  if (subscription === 'pro') {
    return true
  } else if (subscription === 'medior' && expected === 'free') {
    return true
  } else if (subscription === expected) {
    return true
  } else {
    return false
  }
}

export function getMax (type: 'encounter'|'campaign', subscription: StripeSubscriptionType): number {
  if (subscription === 'free') {
    return type === 'encounter' ? 10 : 3
  } else if (subscription === 'medior') {
    return type === 'encounter' ? 50 : 10
  } else if (subscription === 'pro') {
    return type === 'encounter' ? 250 : 25
  }
  return 0
}
