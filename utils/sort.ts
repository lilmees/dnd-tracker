export function sortByNumber<T> (arr: T[], key: string, acs = true): T[] {
  return arr.sort((a: T, b: T) => {
    const aValue = Array.isArray(a[key as keyof T])
      ? (a[key as keyof T] as unknown[]).length
      : a[key as keyof T] as number

    const bValue = Array.isArray(b[key as keyof T])
      ? (b[key as keyof T] as unknown[]).length
      : b[key as keyof T] as number

    if (aValue === null || aValue === undefined) {
      return bValue === null || bValue === undefined ? 0 : 1
    } else if (bValue === null || bValue === undefined) {
      return -1
    }

    return acs ? aValue - bValue : bValue - aValue
  })
}

export function sortByString<T> (arr: T[], key: string, acs = true): T[] {
  return arr.sort((a: T, b: T) => {
    const aValue: string = a[key as keyof T] as string
    const bValue: string = b[key as keyof T] as string

    if (!aValue && !bValue) {
      return 0
    } else if (!aValue) {
      return 1
    } else if (!bValue) {
      return -1
    }

    return acs ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
  })
}

export function sortCreatedAt<T extends { created_at: string }> (arr: T[]): T[] {
  return arr.sort((a, b) => {
    return new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf()
  })
}

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
    groupObj[key].encounters = sortCreatedAt(groupObj[key].encounters) as Encounter[]
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

export function sortCampaignsByCreatedAt (campaigns: Campaign[], userId: string) : {
  userArr: Campaign[],
  nonUserArr: Campaign[]
} {
  const { userArr, nonUserArr } = campaigns.reduce((acc, cam) => {
    cam.created_by.id === userId
      ? acc.userArr.push(cam)
      : acc.nonUserArr.push(cam)

    return acc
  },
  { userArr: [], nonUserArr: [] } as { userArr: Campaign[], nonUserArr: Campaign[]}
  )

  return { userArr, nonUserArr }
}
