import { createSlackAdapter } from '@chat-adapter/slack'
import { createMemoryState } from '@chat-adapter/state-memory'
import { Chat, type Message, type Thread } from 'chat'

import { env } from './env'
import { getReply } from './replies'

export const bot = new Chat({
  userName: 'pe-intelligence-demo',
  adapters: {
    slack: createSlackAdapter({
      botToken: env.slackBotToken,
      signingSecret: env.slackSigningSecret,
    }),
  },
  state: createMemoryState(),
  concurrency: 'queue',
})

async function reply(thread: Thread, message: Message) {
  await thread.post(getReply(message.text))
}

bot.onNewMention(async (thread, message) => {
  await thread.subscribe()
  await reply(thread, message)
})

bot.onSubscribedMessage(reply)
bot.onDirectMessage(reply)
