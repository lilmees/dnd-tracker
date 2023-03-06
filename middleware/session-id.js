export default defineNuxtRouteMiddleware(async to => {
  if (!to.query.session_id) return abortNavigation()
})
