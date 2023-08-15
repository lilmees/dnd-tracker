export function encounterUrl (encounter: Encounter): string {
  const title: string = encounter.title.replace(/[^a-zA-Z0-9]+/g, '-')

  return `/encounters/${encounter.id}${title === '-' ? '-encounter' : `-${title}`}`
}

export function campaignUrl (campaign: Campaign): string {
  const title: string = campaign.title.replace(/[^a-zA-Z0-9]+/g, '-')

  return `/campaigns/${campaign.id}${title === '-' ? '-campaign' : `-${title}`}`
}

export function backUrl (campaign: Campaign | number | undefined): string {
  if (!campaign) {
    return '/encounters'
  }

  const isCampaign: boolean = typeof campaign === 'object'
  const id: number = isCampaign ? (campaign as Campaign).id : campaign as number
  const title: string = isCampaign
    ? (campaign as Campaign).title.replace(/[^a-zA-Z0-9]+/g, '-')
    : 'campaign'

  return `/campaigns/${id}${title === '-' ? '-campaign' : `-${title}`}`
}
