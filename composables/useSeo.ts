import seo from '@/fixtures/seo'

export const useSeo = (): void => {
  const { locale } = useI18n({ useScope: 'global' })
  const appName = 'DnD Tracker'

  if (import.meta.dev) {
    seo.url = 'http://localhost:3000'
  }

  useSeoMeta({ ogUrl: seo.url })

  useHead({
    titleTemplate: title => (title && title.toLowerCase() !== 'en' ? `${title} | ${appName}` : appName),
    htmlAttrs: { lang: locale.value },
    meta: [
      { hid: 'description', name: 'description', content: seo.description },
      { hid: 'robots', name: 'robots', content: 'index,follow' },
      { hid: 'apple-mobile-web-app-title', name: 'apple-mobile-web-app-title', content: appName },
      { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
      { hid: 'twitter:title', name: 'twitter:title', content: seo.name },
      { hid: 'twitter:description', name: 'twitter:description', content: seo.description },
      { hid: 'twitter:image', name: 'twitter:image', content: seo.logo },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:site_name', property: 'og:site_name', content: seo.name },
      { hid: 'og:image', property: 'og:image', content: seo.logo },
      { hid: 'og:title', property: 'og:title', content: seo.name },
      { hid: 'og:description', property: 'og:description', content: seo.description },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/png',
        href: '/pwa-192.png',
      },
    ],
  })

  useSchemaOrg([
    defineOrganization({
      name: appName,
      url: seo.url,
      logo: seo.logo,
    }),
    defineWebSite({ name: seo.name }),
  ])
}
