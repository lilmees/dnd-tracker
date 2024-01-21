import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole(event)
  const id = getRouterParam(event, 'id')

  const { data, error } = await supabase
    .from('initiative_sheets')
    .select('rows, title, info, background, color, settings, activeIndex, round, info_cards')
    .eq('id', `${id}`)
    .single()

  if (error) {
    throw error
  } else {
    return data
  }
})
