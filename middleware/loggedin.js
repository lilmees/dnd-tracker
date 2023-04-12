export default defineNuxtRouteMiddleware(() => {
  const user = useSupabaseUser()
  const localePath = useLocalePath()
  if (user.value) {
    return navigateTo(localePath('/'))
  }
})
