export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser()
  const localePath = useLocalePath()
  if (!user.value) return navigateTo(localePath('/login'))
})
