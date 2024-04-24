export async function sbQuery<T> (options: SbFetchOptions): Promise<SbQuery<T>> {
  const supabase = useSupabaseClient()

  const { table, select, page, perPage, filters, eq, fuzzy, fields } = options

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
    query = query.or(sbOrQuery(fields || ['title'], filters.search))
  }

  const { data, error, count } = await query

  if (error) { throw error }

  return {
    data: data as T[],
    pagesCount: perPage ? calcPages(count, perPage) : 1,
    count
  }
}

function sbOrQuery (keys: string[], search: string): string {
  let queryString = ''

  keys.forEach((key: string, i: number) => {
    const escapedSearch = search.replace(/([%_])/g, '\\$1')
    queryString += `${i ? ',' : ''}${key}.ilike.*${escapedSearch}*`
  })

  return queryString
}

export function generateRange (page: number, perPage: number): SbRange {
  const from = page ? page * perPage : 0
  const to = page ? from + perPage - 1 : perPage - 1

  return { from, to }
}

export function calcPages (count: number | null, perPage: number): number {
  return Math.ceil((count || 1) / perPage)
}
