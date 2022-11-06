export const sortByTeam = encounters => {
  const groupObj = {}
  encounters.forEach(encounter => {
    if (groupObj[encounter.group || '0']) {
      const array = groupObj[encounter.group || '0']
      array.push(encounter)
      groupObj[encounter.group || '0'] = array.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    } else groupObj[encounter.group || '0'] = [encounter]
  })
  return groupObj
}
