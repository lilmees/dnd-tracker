function getValueFromNestedKeys<T> (v: T, keys: string): any {
  let value: any = v

  for (const key of keys.split('.')) {
    if (!value) { return value }
    value = value[key as keyof T] as any
  }

  return value
}

export function sortArray<T> (arr: T[], key: string, acs = true) : T[] {
  return [...arr].sort((a: T, b: T) => {
    const aValue = getValueFromNestedKeys<T>(a, key)
    const bValue = getValueFromNestedKeys<T>(b, key)

    return typeof aValue === 'number' || Array.isArray(aValue)
      ? sortByNumber(aValue, bValue, acs)
      : sortByString(aValue, bValue, acs)
  })
}

export function sortByNumber (a: number|any[], b: number|any[], acs: boolean): number {
  a = Array.isArray(a) ? a.length : a
  b = Array.isArray(b) ? b.length : b

  if (a == null) {
    return b == null ? 0 : 1
  } else if (b == null) {
    return -1
  }

  return acs ? a - b : b - a
}

export function sortByString (a: string, b: string, acs: boolean): number {
  a = a ?? ''
  b = b ?? ''

  return acs ? a.localeCompare(b) : b.localeCompare(a)
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
        campaign: encounter.campaign,
        created_by: encounter.campaign.created_by.id
      }
    }

    groupObj[key]?.encounters
      ? groupObj[key].encounters.push(encounter)
      : groupObj[key] = { ...groupObj[key], encounters: [encounter] }
  })

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
