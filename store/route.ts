export const useRouteStore = defineStore('useRouteStore', () => {
  const routes = ref<Route[]>([
    { label: 'components.navbar.contact', url: 'contact', requiredLogIn: false, requiredLogOut: false }
    // { label: 'components.navbar.pricing', url: 'pricing', requiredLogIn: false, requiredLogOut: false },
  ])

  const playRoutes = ref<Route[]>([
    { label: 'components.navbar.campaigns', url: 'campaigns', requiredLogIn: true, requiredLogOut: false },
    { label: 'components.navbar.encounters', url: 'encounters', requiredLogIn: true, requiredLogOut: false }
  ])

  const profileRoutes = ref<Route[]>([
    { label: 'components.navbar.profile', url: 'profile', requiredLogIn: true, requiredLogOut: false }
  ])

  return {
    routes,
    playRoutes,
    profileRoutes
  }
})
