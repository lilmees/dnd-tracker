export function hasPermission (role: UserRole, admin = false, owner = false): boolean {
  if (!admin && !owner) {
    return true
  } else if (admin && !owner) {
    return role === 'Admin' || role === 'Owner'
  } else if (!admin && owner) {
    return role === 'Owner'
  } else {
    return false
  }
}

export function isOwner (campaign: Campaign, id: string): boolean {
  return campaign.created_by.id === id
}

export function isAdmin (campaign: Campaign, id: string): boolean {
  if (campaign.created_by.id === id) {
    return true
  }

  return !!campaign.team?.find(u => u.user.id === id && u.role === 'Admin') || false
}

export function isMember (campaign: Campaign, id: string): boolean {
  if (campaign.created_by.id === id) {
    return true
  }

  return !!campaign.team?.find(u => u.user.id === id) || false
}

export function isInvited (campaign: Campaign, id: string): boolean {
  return campaign.join_campaign?.map(join => join.user.id).includes(id) || false
}
