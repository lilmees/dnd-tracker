export const minutesAgo = (minutes, time) => {
  if (!time) {
    return false
  }
  const minute = minutes * 60 * 100
  return time + minute < Date.now()
}
