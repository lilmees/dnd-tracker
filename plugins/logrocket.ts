import type { Pinia, Store } from 'pinia'
import logRocket from 'logrocket'

export default defineNuxtPlugin(({ pinia }) => {
  const id = useRuntimeConfig()?.public?.logRocket

  if (!id || process.env.NODE_ENV !== 'production') {
    return
  }

  logRocket.init(id)

  if (pinia) {
    (pinia as Pinia).use(({ store }: {store: Store}) => {
      store.$subscribe(m => logRocket.log('mutation', m))
    })
  }
})
