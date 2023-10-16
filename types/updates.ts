type FeatureRequestVote = 'like' | 'dislike'

type FeatureRequestStatus = 'review' | 'accepted' | 'progress'

type FeaturesSortBy = 'voted_most' | 'voted_least' | 'first_new' | 'first_old'

type FeaturesType = 'all' | 'my'

interface FeatureRequestVotes {
  like: string[]
  dislike: string[]
}

interface FeatureRequest {
  id: string
  created_at: string
  created_by: SocialProfile
  title: string
  text: string
  voted: FeatureRequestVotes
  status: FeatureRequestStatus
}

interface NewFeatureRequest extends Omit<FeatureRequest, 'id'|'created_at'|'created_by'> {
  created_by: string
}

interface FeatureItems {
  title: string
  items: [{
    text: string,
    adminOnly?: boolean
  }]
}

interface ChangelogItem {
  version: string
  date: string,
  features: FeatureItems[]
}
