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

  async function addHomebrew (homebrew: Homebrew): Promise<Homebrew> {
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

  async function updateHomebrew (homebrew: Homebrew, id: number): Promise<Homebrew> {
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
      { type: 'player', id: 'nelson', name: 'Nelson', health: '37', ac: '13' },
      { type: 'player', id: 'silvin', name: 'Silvin', health: '33', ac: '14' },
      { type: 'player', id: 'alexis', name: 'Alexis', health: '29', ac: '12' },
      { type: 'player', id: 'thernus', name: 'Thernus', health: '31', ac: '16' },
      { type: 'player', id: 'banthaaja', name: 'Banthaaja', health: '30', ac: '15' },
      { type: 'monster', id: 'lulu', name: 'Lulu', health: '69', ac: '20' },
      { type: 'monster', id: 'pony', name: 'Pony', health: '33', ac: '10' },
      { type: 'npc', id: 'rocky', name: 'Rocky', health: '24', ac: '16' },
      { type: 'npc', id: 'gray', name: 'Gray', health: '20', ac: '16' },
      { type: 'npc', id: 'ginger', name: 'Ginger', health: '10', ac: '18' },
      { type: 'summon', id: 'inli', name: 'Inli', health: '18', ac: '12' },
      { type: 'lair', id: 'lair', name: 'Lair action' }
    ]
  }
})
