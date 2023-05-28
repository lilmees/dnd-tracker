import { defineStore } from 'pinia'

export const useRouteStore = defineStore('useRouteStore', () => {
  const routes: Ref<Route[]> = ref([
    { label: 'navigation.about', url: 'about', requiredLogIn: false, requiredLogOut: false },
    { label: 'navigation.contact', url: 'contact', requiredLogIn: false, requiredLogOut: false }
    // { label: 'navigation.pricing', url: 'pricing', requiredLogIn: false, requiredLogOut: false },
  ])

  const playRoutes: Ref<Route[]> = ref([
    { label: 'navigation.campaigns', url: 'campaigns', requiredLogIn: true, requiredLogOut: false },
    { label: 'navigation.encounters', url: 'encounters', requiredLogIn: true, requiredLogOut: false }
  ])

  const profileRoutes: Ref<Route[]> = ref([
    { label: 'navigation.profile', url: 'profile', requiredLogIn: true, requiredLogOut: false }
  ])

  return {
    routes,
    playRoutes,
    profileRoutes
  }
})
