export default defineNuxtRouteMiddleware((to) => {
  if (!to.query.session_id) {
    return abortNavigation()
  }
})
