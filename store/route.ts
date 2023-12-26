export const useRouteStore = defineStore('useRouteStore', () => {
  const routes = ref<Route[]>([
    { label: 'components.navbar.contact', url: 'contact', requiredLogIn: false },
    { label: 'components.navbar.pricing', url: 'pricing', requiredLogIn: false }
  ])

  const playRoutes = ref<Route[]>([
    { label: 'components.navbar.campaigns', url: 'campaigns', requiredLogIn: true },
    { label: 'components.navbar.encounters', url: 'encounters', requiredLogIn: true },
    { label: 'components.navbar.fantasy', url: 'fantasy-name-generator', requiredLogIn: false },
    { label: 'components.navbar.info', url: 'info', requiredLogIn: false },
    { label: 'components.navbar.map', url: 'map', requiredLogIn: false }
  ])

  const profileRoutes = ref<Route[]>([
    { label: 'components.navbar.profile', url: 'profile', requiredLogIn: true }
  ])

  return {
    routes,
    playRoutes,
    profileRoutes
  }
})
