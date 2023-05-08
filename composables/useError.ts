export const useError = (error: unknown): string => {
  let e = ''

  if (typeof error === 'string') {
    e = error.toUpperCase()
  } else if (error instanceof Error) {
    e = error.message
  }

  return e
}
