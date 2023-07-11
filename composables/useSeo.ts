import meta from '@/seo/meta.json'

export const useSeo = (): void => {
  const { locale } = useI18n({ useScope: 'global' })
  const appName = 'DND TRACKER'

  useLocaleHead({
    addDirAttribute: true,
    identifierAttribute: 'hid',
    addSeoAttributes: true
  })

  useHead({
    titleTemplate: title => (title ? `${title} | ${appName}` : appName),
    htmlAttrs: {
      lang: locale.value
    },
    meta: [
      { hid: 'description', name: 'description', content: meta.description },
      { hid: 'robots', name: 'robots', content: 'index,follow' },
      { hid: 'apple-mobile-web-app-title', name: 'apple-mobile-web-app-title', content: meta.title },
      { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
      { hid: 'twitter:title', name: 'twitter:title', content: meta.twitter_title },
      { hid: 'twitter:description', name: 'twitter:description', content: meta.twitter_description },
      { hid: 'twitter:image', name: 'twitter:image', content: meta.twitter_image },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:site_name', property: 'og:site_name', content: meta.og_sitename },
      { hid: 'og:image', property: 'og:image', content: meta.og_image },
      { hid: 'og:title', property: 'og:title', content: meta.og_title },
      { hid: 'og:description', property: 'og:description', content: meta.og_description }
    ]
  })

  useSchemaOrg([
    defineOrganization({
      name: appName,
      url: 'https://dnd-tracker.com',
      logo: 'https://dnd-tracker.com/socials.png'
    }),
    defineWebSite({ name: 'DnD Tracker: Effortless Encounter Management' })
  ])
}
