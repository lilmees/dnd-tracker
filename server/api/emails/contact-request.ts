import { useCompiler } from '#vue-email'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { transporter } = event.context

  try {
    const { html } = await useCompiler('ContactRequest.vue', {
      props: body.props,
    })

    const options = {
      from: body.props.email,
      to: 'jeremy@dnd-tracker.com',
      subject: 'New contact request/question',
      html,
    }

    return await transporter.sendMail(options)
  }
  catch (err) {
    throw new Error('Failed to send email.')
  }
})
