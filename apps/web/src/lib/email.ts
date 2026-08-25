import { env } from 'cloudflare:workers'
import { emailFrom, setEmailSender } from '@repo/auth'

setEmailSender((message) =>
  env.EMAIL.send({
    to: message.to,
    from: {
      email: message.from?.email ?? emailFrom,
      name: message.from?.name ?? 'Pe Intelligence',
    },
    subject: message.subject,
    ...(message.text ? { text: message.text } : {}),
    ...(message.html ? { html: message.html } : {}),
    ...(message.replyTo ? { replyTo: message.replyTo } : {}),
  }),
)
