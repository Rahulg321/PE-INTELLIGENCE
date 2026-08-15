export function getReply(text: string) {
  const command = text.toLowerCase()

  if (command.includes('help')) {
    return {
      markdown:
        '**Chat SDK demo**\n\n- `help` — show commands\n- `status` — check the bot',
    }
  }

  if (command.includes('status')) {
    return { markdown: 'The Chat SDK demo is running.' }
  }

  return { markdown: 'Message received. Try `help` or `status`.' }
}
