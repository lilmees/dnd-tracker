export const useStripeStore = defineStore('useStripeStore', () => {
  const { $i18n } = useNuxtApp()
  const config = useRuntimeConfig()
  const localePath = useLocalePath()
  const profile = useProfileStore()
  const user = useSupabaseUser()

  async function subscribe (lookup: string, locale: string): Promise<void> {
    if (!user || !profile.data) {
      navigateTo(localePath('/login'))
    }

    const { data } = await useFetch('/api/stripe/subscribe', {
      method: 'POST',
      body: {
        user: user.value,
        lookup,
        locale,
        customer: profile.data!.stripe_id
      }
    })

    if (data.value) {
      navigateTo(data.value.url, { external: true })
    }
  }

  async function createPortalSession (id: string): Promise<void> {
    const { data } = await useFetch('/api/stripe/create_portal_session', {
      method: 'POST',
      body: { session_id: id }
    })

    if (data.value) {
      navigateTo(data.value.url, { external: true })
    }
  }

  return {
    subscribe,
    createPortalSession,
    products: [
      {
        title: 'Starter',
        description: $i18n.t('pages.pricing.starter'),
        prices: [0],
        items: [
          { label: $i18n.t('pages.pricing.encounters', { number: 10 }), icon: 'check' },
          { label: $i18n.t('pages.pricing.campaigns', { number: 3 }), icon: 'check' },
          { label: $i18n.t('pages.pricing.multiple'), icon: 'cross' },
          { label: $i18n.t('pages.pricing.setup'), icon: 'check' },
          { label: $i18n.t('pages.pricing.update'), icon: 'check' }
        ]
      },
      {
        title: 'Medior',
        description: $i18n.t('pages.pricing.medior'),
        prices: [3, 32.50],
        items: [
          { label: $i18n.t('pages.pricing.encounters', { number: 50 }), icon: 'check' },
          { label: $i18n.t('pages.pricing.campaigns', { number: 10 }), icon: 'check' },
          { label: $i18n.t('pages.pricing.multiple'), icon: 'cross' },
          { label: $i18n.t('pages.pricing.setup'), icon: 'check' },
          { label: $i18n.t('pages.pricing.update'), icon: 'check' }
        ],
        monthId: config.public.stripeMediorMonthly,
        yearId: config.public.stripeMediorYearly
      },
      {
        title: 'Pro',
        description: $i18n.t('pages.pricing.pro'),
        prices: [5, 50],
        items: [
          { label: $i18n.t('pages.pricing.encounters', { number: 'infinite' }), icon: 'check' },
          { label: $i18n.t('pages.pricing.campaigns', { number: 'infinite' }), icon: 'check' },
          { label: $i18n.t('pages.pricing.multiple'), icon: 'check' },
          { label: $i18n.t('pages.pricing.setup'), icon: 'check' },
          { label: $i18n.t('pages.pricing.update'), icon: 'check' }
        ],
        monthId: config.public.stripeProMonthly,
        yearId: config.public.stripeProYearly
      }
    ] as Pricing[]
  }
})
