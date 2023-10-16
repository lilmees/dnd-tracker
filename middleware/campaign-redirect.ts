export default defineNuxtRouteMiddleware(({ fullPath, params }) => {
  if (params.id && params.title) {
    return navigateTo(`${fullPath}/content`)
  } else {
    return abortNavigation()
  }
})
