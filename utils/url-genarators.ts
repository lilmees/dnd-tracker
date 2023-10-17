export function encounterUrl (encounter: Encounter): string {
  const title: string = encounter.title.replace(/[^a-zA-Z0-9]+/g, '-')

  return `/encounters/${encounter.id}${title === '-' ? '-encounter' : `-${title}`}`
}

export function campaignUrl (campaign: Campaign, type: CampaignPageType): string {
  const title: string = campaign.title.replace(/[^a-zA-Z0-9]+/g, '-')

  return `/campaigns/${campaign.id}${title === '-' ? '-campaign' : `-${title}`}/${type}`
}

export function backUrl (campaign: Campaign | undefined): string {
  if (!campaign?.title) {
    return '/encounters'
  }
  const title: string = campaign.title.replace(/[^a-zA-Z0-9]+/g, '-')

  return `/campaigns/${campaign.id}${title === '-' ? '-campaign' : `-${title}`}`
}
