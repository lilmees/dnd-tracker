import { createTransport } from 'nodemailer'

export default eventHandler((event) => {
  const { mailAddress: user, mailPassword: pass } = useRuntimeConfig()

  if (!event.context.transporter) {
    event.context.transporter = createTransport({
      host: process.env.HOST || 'smtp.ethereal.email',
      service: 'gmail',
      auth: { user, pass },
    })
  }
})
