import { useServerStripe } from '#stripe/server'

export default defineEventHandler(async (event): Promise<StripeProduct[]> => {
  const stripe = await useServerStripe(event)

  const { data: products } = await stripe.products.list({ active: true })
  const { data: prices } = await stripe.prices.list({ active: true })

  const groupedProducts: StripeProduct[] = []

  products.forEach((product) => {
    const productPrices = prices.filter(price => price.product === product.id)

    const monthPrice = productPrices.find(price => price.recurring?.interval === 'month')
    const yearPrice = productPrices.find(price => price.recurring?.interval === 'year')

    groupedProducts.push({
      name: product.name,
      prices: productPrices.map(price => (price.unit_amount || 0) / 100),
      monthId: monthPrice?.id || '',
      yearId: yearPrice?.id || ''
    })
  })

  return groupedProducts
})
