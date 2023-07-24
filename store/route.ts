export const useRouteStore = defineStore('useRouteStore', () => {
  const routes: Ref<Route[]> = ref([
    { label: 'components.navbar.about', url: 'about', requiredLogIn: false, requiredLogOut: false },
    { label: 'components.navbar.contact', url: 'contact', requiredLogIn: false, requiredLogOut: false }
    // { label: 'components.navbar.pricing', url: 'pricing', requiredLogIn: false, requiredLogOut: false },
  ])

  const playRoutes: Ref<Route[]> = ref([
    { label: 'components.navbar.campaigns', url: 'campaigns', requiredLogIn: true, requiredLogOut: false },
    { label: 'components.navbar.encounters', url: 'encounters', requiredLogIn: true, requiredLogOut: false }
  ])

  const profileRoutes: Ref<Route[]> = ref([
    { label: 'components.navbar.profile', url: 'profile', requiredLogIn: true, requiredLogOut: false }
  ])

  return {
    routes,
    playRoutes,
    profileRoutes
  }
})
