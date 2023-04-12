export const sortByTeam = (encounters) => {
  const groupObj = {}
  encounters.forEach((encounter) => {
    const key = encounter.campaign?.id || encounter.campaign
    if (groupObj[key || '0']) {
      const array = groupObj[key || '0']
      array.push(encounter)
      groupObj[key || '0'] = array.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    } else {
      groupObj[key || '0'] = [encounter]
    }
  })
  return groupObj
}
