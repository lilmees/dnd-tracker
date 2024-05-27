import { useServerStripe } from '#stripe/server'

export default defineEventHandler(async (event): Promise<StripeProduct[]> => {
  const stripe = await useServerStripe(event)

  const { data: products } = await stripe.products.list({ active: true })
  const { data: prices } = await stripe.prices.list({ active: true })

  const groupedProducts: StripeProduct[] = []

  products.forEach((product) => {
    const price = prices.find(price => price.product === product.id)

    if (price) {
      groupedProducts.push({
        name: product.name,
        price: (price.unit_amount || 0) / 100,
        id: price.id,
      })
    }
  })

  return groupedProducts
})
