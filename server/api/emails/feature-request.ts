import nodemailer from 'nodemailer'
import { useCompiler } from '#vue-email'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  const template = await useCompiler('FeatureRequest.vue', {
    props: body.props
  })

  const transporter = nodemailer.createTransport({
    host: process.env.HOST || 'smtp.ethereal.email',
    service: 'gmail',
    auth: {
      user: config.mailAddress,
      pass: config.mailPassword
    }
  })

  const options = {
    from: body.props.email,
    to: 'jeremy@dnd-tracker.com',
    subject: 'New feature request',
    html: template
  }

  await transporter.sendMail(options)

  return { message: 'Email sent' }
})
