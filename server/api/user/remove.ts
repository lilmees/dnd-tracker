import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole(event)
  const body: { id: string } = await readBody(event)

  return await supabase.auth.admin.deleteUser(body.id)
})
