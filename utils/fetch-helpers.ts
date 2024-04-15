export async function sbQuery<T> (options: SupabaseFetchOptions): Promise<{
  data: T[],
  count: number | null
}> {
  const supabase = useSupabaseClient()

  let query = supabase
    .from(options.table)
    .select(options.select || '*', { count: 'exact' })

  if (options.page && options.perPage) {
    const { from, to } = generateRange(options.page, options.perPage)

    query = query.range(from, to)
  }

  if (options.filters) {
    query = query.order(options.filters.sortedBy, { ascending: options.filters.sortACS })
  }

  if (options.eq) {
    query = query.eq(options.eq.field, options.eq.value)
  }

  if (options.filters?.search && options.fuzzy) {
    query = query.ilike(options.field || 'title', `%${options.filters.search}%`)
  }

  const { data, error, count } = await query

  if (error) { throw error }

  return { data: data as T[], count }
}

export function generateRange (page: number, perPage: number): { from: number, to: number } {
  const from = page ? page * perPage : 0
  const to = page ? from + perPage - 1 : perPage - 1

  return { from, to }
}

export function calcPages (count: number | null, perPage: number): number {
  return Math.ceil((count || 1) / perPage)
}
