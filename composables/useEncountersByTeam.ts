export const useEncountersByTeam = (encounters: Encounter[]): { [key: string]: Encounter[] } => {
  const groupObj: { [key: string]: Encounter[] } = {}
  encounters.forEach((encounter) => {
    const key = typeof encounter.campaign === 'object'
      ? encounter.campaign?.id
      : encounter.campaign

    if (groupObj[key || '0']) {
      const array = groupObj[key || '0']
      array.push(encounter)
      groupObj[key || '0'] = array
        .sort((a: Encounter, b: Encounter) => new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf())
    } else {
      groupObj[key || '0'] = [encounter]
    }
  })
  return groupObj
}
