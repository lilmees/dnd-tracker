export const useStripeStore = defineStore('useStripeStore', () => {
  const { t } = useI18n()
  const localePath = useLocalePath()
  const profile = useProfileStore()
  const user = useSupabaseUser()

  const loading = ref<boolean>(true)
  const products = ref<ProductPricing[]>([
    {
      type: 'free',
      title: 'Starter',
      description: t('pages.pricing.starter'),
      prices: [0],
      items: [
        { label: t('pages.pricing.encounters', { number: 10 }), icon: 'check' },
        { label: t('pages.pricing.campaigns', { number: 3 }), icon: 'check' },
        { label: t('pages.pricing.multiple'), icon: 'cross' },
        { label: t('pages.pricing.live'), icon: 'cross' },
        { label: t('pages.pricing.update'), icon: 'check' }
      ]
    },
    {
      type: 'medior',
      title: 'Medior',
      description: t('pages.pricing.medior'),
      items: [
        { label: t('pages.pricing.encounters', { number: 50 }), icon: 'check' },
        { label: t('pages.pricing.campaigns', { number: 10 }), icon: 'check' },
        { label: t('pages.pricing.multiple'), icon: 'cross' },
        { label: t('pages.pricing.live'), icon: 'check' },
        { label: t('pages.pricing.update'), icon: 'check' }
      ]
    },
    {
      type: 'pro',
      title: 'Pro',
      description: t('pages.pricing.pro'),
      items: [
        { label: t('pages.pricing.encounters', { number: 250 }), icon: 'check' },
        { label: t('pages.pricing.campaigns', { number: 25 }), icon: 'check' },
        { label: t('pages.pricing.multiple'), icon: 'check' },
        { label: t('pages.pricing.live'), icon: 'check' },
        { label: t('pages.pricing.update'), icon: 'check' }
      ]
    }
  ])

  async function fetchProducts (): Promise<void> {
    const stripeProducts = await $fetch('/api/stripe/products')

    products.value.push()

    stripeProducts.forEach((product) => {
      const { name, prices, monthId, yearId } = product
      const key = name.replace(' plan', '').toLowerCase() as StripeSubscriptionType
      const index = products.value.findIndex(product => product.type === key)

      if (index >= 0) {
        products.value[index] = { ...products.value[index], prices, monthId, yearId }
      }
    })

    loading.value = false
  }

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

  onMounted(async () => {
    await fetchProducts()
  })

  return {
    products,
    loading,
    subscribe,
    createPortalSession,
    fetchProducts
  }
})
