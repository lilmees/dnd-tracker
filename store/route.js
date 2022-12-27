import { defineStore } from 'pinia'

export const useRouteStore = defineStore('useRouteStore', {
  state: () => ({
    routes: [
      { label: 'navigation.home', url: '/', requiredLogIn: false, requiredLogOut: false },
      { label: 'navigation.profile', url: '/profile', requiredLogIn: true, requiredLogOut: false },
      { label: 'navigation.login', url: '/login', requiredLogIn: false, requiredLogOut: true },
    ],
    dropdown: [
      { label: 'navigation.campaigns', url: '/campaigns', requiredLogIn: true, requiredLogOut: false },
      { label: 'navigation.encounters', url: '/encounters', requiredLogIn: true, requiredLogOut: false },
    ],
  }),
})
