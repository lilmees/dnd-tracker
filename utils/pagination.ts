export function generateRange (page: number, perPage: number): { from: number, to: number } {
  const from = page ? page * perPage : 0
  const to = page ? from + perPage - 1 : perPage - 1

  return { from, to }
}

export function calcPages (count: number, perPage: number): number {
  return Math.ceil(count / perPage)
}
