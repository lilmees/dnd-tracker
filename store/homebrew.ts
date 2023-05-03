import { defineStore } from 'pinia'

export const useHomebrewStore = defineStore('useHomebrewStore', () => {
  const supabase = useSupabaseClient()

  async function getHomebrewByCampaignId (id: number): Promise<Homebrew[]> {
    const { data, error } = await supabase.from('homebrew_items')
      .select('*')
      .eq('campaign', id)

    if (error) {
      throw error
    }

    return data
  }

  async function getHomebrewById (id: number): Promise<Homebrew> {
    const { data, error } = await supabase.from('homebrew_items')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    return data
  }

  async function getHomebrewByType (type: HomebrewType): Promise<Homebrew[]> {
    const { data, error } = await supabase.from('homebrew_items')
      .select('*')
      .eq('type', type)

    if (error) {
      throw error
    }

    return data
  }

  async function addHomebrew (homebrew: AddHomebrew): Promise<Homebrew> {
    const { data, error } = await supabase.from('homebrew_items')
      .insert([homebrew as never])
      .select('*')

    if (error) {
      throw error
    } else {
      return data[0] as Homebrew
    }
  }

  async function deleteHomebrew (id: number): Promise<void> {
    const { error } = await supabase.from('homebrew_items')
      .delete()
      .eq('id', id)
      .select('*')

    if (error) {
      throw error
    }
  }

  async function updateHomebrew (homebrew: HomebrewUpdate, id: number): Promise<Homebrew> {
    const { data, error } = await supabase.from('homebrew_items')
      .update(homebrew as never)
      .eq('id', id)
      .select('*')

    if (error) {
      throw error
    }

    return data[0]
  }

  return {
    getHomebrewByCampaignId,
    getHomebrewById,
    getHomebrewByType,
    addHomebrew,
    updateHomebrew,
    deleteHomebrew,
    sandbox: [
      { type: 'player', id: 1, name: 'Nelson', health: '37', ac: '13', created_at: 'now', campaign: 1 },
      { type: 'player', id: 2, name: 'Silvin', health: '33', ac: '14', created_at: 'now', campaign: 1 },
      { type: 'player', id: 3, name: 'Alexis', health: '29', ac: '12', created_at: 'now', campaign: 1 },
      { type: 'player', id: 4, name: 'Thernus', health: '31', ac: '16', created_at: 'now', campaign: 1 },
      { type: 'player', id: 5, name: 'Banthaaja', health: '30', ac: '15', created_at: 'now', campaign: 1 },
      { type: 'monster', id: 6, name: 'Lulu', health: '69', ac: '20', created_at: 'now', campaign: 1 },
      { type: 'monster', id: 7, name: 'Pony', health: '33', ac: '10', created_at: 'now', campaign: 1 },
      { type: 'npc', id: 8, name: 'Rocky', health: '24', ac: '16', created_at: 'now', campaign: 1 },
      { type: 'npc', id: 9, name: 'Gray', health: '20', ac: '16', created_at: 'now', campaign: 1 },
      { type: 'npc', id: 10, name: 'Ginger', health: '10', ac: '18', created_at: 'now', campaign: 1 },
      { type: 'summon', id: 11, name: 'Inli', health: '18', ac: '12', created_at: 'now', campaign: 1 },
      { type: 'lair', id: 12, name: 'Lair action', created_at: 'now', campaign: 1 }
    ] as Homebrew[]
  }
})
