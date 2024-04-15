export async function sbQuery<T> (options: SbFetchOptions): Promise<SbQuery<T>> {
  const supabase = useSupabaseClient()

  const { table, select, page, perPage, filters, eq, fuzzy, field } = options

  let query = supabase
    .from(table)
    .select(select || '*', { count: 'exact' })

  if (typeof page === 'number' && typeof perPage === 'number') {
    const { from, to } = generateRange(page, perPage)

    query = query.range(from, to)
  }

  if (filters) {
    query = query.order(filters.sortedBy, { ascending: filters.sortACS })
  }

  if (eq) {
    query = query.eq(eq.field, eq.value)
  }

  if (filters?.search && fuzzy) {
    query = query.ilike(field || 'title', `%${filters.search}%`)
  }

  const { data, error, count } = await query

  if (error) { throw error }

  return { data: data as T[], count }
}

export function generateRange (page: number, perPage: number): SbRange {
  const from = page ? page * perPage : 0
  const to = page ? from + perPage - 1 : perPage - 1

  return { from, to }
}

export function calcPages (count: number | null, perPage: number): number {
  return Math.ceil((count || 1) / perPage)
}
