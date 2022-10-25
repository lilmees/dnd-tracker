import { defineStore } from 'pinia'

export const useRouteStore = defineStore('useRouteStore', {
  state: () => ({
    routes: [
      { label: 'Home', url: '/', requiredLogIn: false, requiredLogOut: false },
      { label: 'Encounters', url: '/encounters', requiredLogIn: true, requiredLogOut: false },
      { label: 'Profile', url: '/profile', requiredLogIn: true, requiredLogOut: false },
      { label: 'login', url: '/login', requiredLogIn: false, requiredLogOut: true },
    ],
  }),
})
