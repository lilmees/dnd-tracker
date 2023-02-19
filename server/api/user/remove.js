import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async event => {
  const supabase = serverSupabaseServiceRole(event)
  const body = await readBody(event)

  return await supabase.auth.admin.deleteUser(body.id)
})
