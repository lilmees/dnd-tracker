export function sortEncountersByCampaign (encounters: Encounter[]) : SortedCampaignEncounter {
  const groupObj: SortedCampaignEncounter = {}

  encounters.forEach((encounter) => {
    const key: string = encounter.campaign?.id?.toString() || '0'

    if (encounter.campaign) {
      groupObj[key] = {
        ...groupObj[key],
        campaign: encounter.campaign.id,
        created_by: encounter.campaign.created_by.id
      }
    }

    groupObj[key]?.encounters
      ? groupObj[key].encounters.push(encounter)
      : groupObj[key] = { ...groupObj[key], encounters: [encounter] }
  })

  for (const key in groupObj) {
    groupObj[key].encounters = groupObj[key].encounters
      .sort((a: Encounter, b: Encounter) => {
        return new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf()
      })
  }

  return groupObj
}

export function sortEncountersByUserCreated (encounters: Encounter[], userId: string) : {
  userArr: Encounter[],
  nonUserArr: Encounter[]
} {
  const { userArr, nonUserArr } = encounters.reduce((acc, enc) => {
    let userEncounter = enc.created_by === userId

    if (enc.campaign) {
      userEncounter = enc.campaign.created_by.id === userId
    }

    userEncounter ? acc.userArr.push(enc) : acc.nonUserArr.push(enc)

    return acc
  },
  { userArr: [], nonUserArr: [] } as { userArr: Encounter[], nonUserArr: Encounter[]}
  )

  return { userArr, nonUserArr }
}
