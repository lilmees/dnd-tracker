import { useCompiler } from '#vue-email'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { transporter } = event.context

  try {
    const { html } = await useCompiler('CampaignInvite.vue', {
      props: body.props,
      i18n: {
        defaultLocale: body.locale,
        translations: {
          en: {
            preview: 'Join the Adventure: Exclusive Invitation to DnD-Tracker Campaign!',
            hello: 'Hello',
            joinStart: 'has invited you to the',
            joinEnd: 'campaign on',
            button: 'Join the campaign',
            paste: 'or copy and paste this URL into your browser:',
            fun: 'We hope you have fun',
            footer: 'If you were not expecting this invitation, you can ignore this email. If you are concerned about your account\'s safety, please reply to this email to get in touch with us.',
          },
          nl: {
            preview: 'Doe mee aan het avontuur: exclusieve uitnodiging voor de DnD-Tracker-campagne!',
            hello: 'Hallo',
            joinStart: 'heeft je uitgenodigd voor de',
            joinEnd: 'campagne op',
            button: 'Sluit je aan bij de campagne',
            paste: 'of kopieer en plak deze URL in uw browser:',
            fun: 'Wij hopen dat je veel plezier hebt',
            footer: 'Als u deze uitnodiging niet had verwacht, kunt u deze e-mail negeren. Als u zich zorgen maakt over de veiligheid van uw account, kunt u deze e-mail beantwoorden om contact met ons op te nemen.',
          },
        },
      },
    })

    const options = {
      from: 'jeremy@dnd-tracker.com',
      to: body.to,
      subject: 'Join the Adventure: Exclusive Invitation to DnD-Tracker Campaign!',
      html,
    }

    return await transporter.sendMail(options)
  }
  catch (err) {
    throw new Error('Failed to send email.')
  }
})
