export const sortByTeam = encounters => {
  const groupObj = {}
  encounters.forEach(encounter => {
    groupObj[encounter.group || '0']
      ? groupObj[encounter.group || '0'].push(encounter)
      : (groupObj[encounter.group || '0'] = [encounter])
  })
  return groupObj
}
