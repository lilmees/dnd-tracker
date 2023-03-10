
import { defineStore } from 'pinia'
import { useProfileStore } from '@/store/profile'

export const useStripeStore = defineStore('useStripeStore', () => {
  const { $i18n } = useNuxtApp()
  const config = useRuntimeConfig()
  const localePath = useLocalePath()
  const profile = useProfileStore()

  async function subscribe(user, lookup, locale) {
    if (!user) navigateTo(localePath('/login'))
    const { data } = await useFetch('/api/stripe/subscribe', {
      method: 'POST',
      body: { user, lookup, locale, customer: profile.data.stripe_id }
    })
    navigateTo(data.value.url, { external: true })
  }

  async function createPortalSession(id) {
    const { data } = await useFetch('/api/stripe/create_portal_session', {
      method: 'POST',
      body: { session_id: id }
    })
    navigateTo(data.value.url, { external: true })
  }

  const products = ref([
    {
      title: 'Starter',
      description: $i18n.t('pricing.starter'),
      prices: [0],
      items: [
        { label: $i18n.t('pricing.encounters', { number: 10 }), icon: 'check' },
        { label: $i18n.t('pricing.campaigns', { number: 3 }), icon: 'check' },
        { label: $i18n.t('pricing.multiple'), icon: 'cross' },
        { label: $i18n.t('pricing.setup'), icon: 'check' },
        { label: $i18n.t('pricing.update'), icon: 'check' },
      ],
    },
    {
      title: 'Medior',
      description: $i18n.t('pricing.medior'),
      prices: [3, 32.50],
      items: [
        { label: $i18n.t('pricing.encounters', { number: 50 }), icon: 'check' },
        { label: $i18n.t('pricing.campaigns', { number: 10 }), icon: 'check' },
        { label: $i18n.t('pricing.multiple'), icon: 'cross' },
        { label: $i18n.t('pricing.setup'), icon: 'check' },
        { label: $i18n.t('pricing.update'), icon: 'check' },
      ],
      monthId: config.public.stripeMediorMonthly,
      yearId: config.public.stripeMediorYearly,
    },
    {
      title: 'Pro',
      description: $i18n.t('pricing.pro'),
      prices: [5, 50],
      items: [
        { label: $i18n.t('pricing.encounters', { number: 'infinite' }), icon: 'check' },
        { label: $i18n.t('pricing.campaigns', { number: 'infinite' }), icon: 'check' },
        { label: $i18n.t('pricing.multiple'), icon: 'check' },
        { label: $i18n.t('pricing.setup'), icon: 'check' },
        { label: $i18n.t('pricing.update'), icon: 'check' },
      ],
      monthId: config.public.stripeProMonthly,
      yearId: config.public.stripeProYearly,
    }
  ])

  return {
    products,
    subscribe,
    createPortalSession
  }
})
