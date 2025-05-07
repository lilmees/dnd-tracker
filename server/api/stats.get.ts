import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole(event)
  const authHeader = getRequestHeader(event, 'Authorization')
  const { trmnl } = useRuntimeConfig()

  if (authHeader !== `Bearer ${trmnl}`) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const tables = ['campaigns', 'homebrew_items', 'initiative_sheets', 'notes', 'profiles', 'team']
  const counts: Record<string, number> = {}

  try {
    await Promise.all(
      tables.map(async (table) => {
        const { count, error, data } = await supabase
          .from(table)
          .select('*', { count: 'exact' })
          .order('id', { ascending: false })
          .limit(1)

        if (error) {
          console.error(`Error fetching count for ${table}:`, error)
          counts[table] = 0
        }
        else {
          counts[table] = data[0] && typeof data[0].id === 'number' ? data[0].id : count ?? 0
        }
      }),
    )

    return counts
  }
  catch (error) {
    console.error('Error fetching stats:', error)
  }
})
