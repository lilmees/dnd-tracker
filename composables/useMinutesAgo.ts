export const useMinutesAgo = (minutes: number, time: number): boolean => {
  if (!time) {
    return false
  }
  const minute = minutes * 60 * 100
  return time + minute < Date.now()
}
