export function isOwner(campaign: Campaign | undefined, id: string): boolean {
  if (!campaign) {
    return false
  }

  return campaign.created_by.id === id
}

export function isAdmin(campaign: Campaign | undefined, id: string): boolean {
  if (!campaign) {
    return false
  }

  if (campaign.created_by.id === id) {
    return true
  }

  return !!campaign.team?.find(u => u.user.id === id && u.role === 'Admin') || false
}

export function isMember(campaign: Campaign | undefined, id: string): boolean {
  if (!campaign) {
    return false
  }

  if (campaign.created_by.id === id) {
    return true
  }

  return !!campaign.team?.find(u => u.user.id === id) || false
}

export function isInvited(campaign: Campaign, id: string): boolean {
  return campaign.join_campaign?.map(join => join.user.id).includes(id) || false
}

export function hasPermission(userRole: UserRole, expected: UserRole): boolean {
  if (userRole === 'Owner') {
    return true
  }
  else if (userRole === 'Admin' && expected === 'Viewer') {
    return true
  }
  else if (userRole === expected) {
    return true
  }
  else {
    return false
  }
}

export function getRole(campaign: Campaign, id: string): UserRole {
  if (isOwner(campaign, id)) {
    return 'Owner'
  }
  else if (isAdmin(campaign, id)) {
    return 'Admin'
  }
  else {
    return 'Viewer'
  }
}
