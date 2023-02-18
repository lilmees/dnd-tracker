import { defineStore } from 'pinia'

export const useRouteStore = defineStore('useRouteStore', {
  state: () => ({
    routes: [
      { label: 'navigation.home', url: '', requiredLogIn: false, requiredLogOut: false },
      { label: 'navigation.contact', url: 'contact', requiredLogIn: false, requiredLogOut: false },
      { label: 'navigation.pricing', url: 'pricing', requiredLogIn: false, requiredLogOut: false },
    ],
    playRoutes: [
      { label: 'navigation.campaigns', url: 'campaigns', requiredLogIn: true, requiredLogOut: false },
      { label: 'navigation.encounters', url: 'encounters', requiredLogIn: true, requiredLogOut: false },
    ],
    profileRoutes: [{ label: 'navigation.profile', url: 'profile', requiredLogIn: true, requiredLogOut: false }],
  }),
})
