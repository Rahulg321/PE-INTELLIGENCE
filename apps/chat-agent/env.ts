import '@repo/env/load'

function requireEnv(name: 'SLACK_BOT_TOKEN' | 'SLACK_SIGNING_SECRET') {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

function getPort() {
  const port = Number(process.env.PORT ?? 3001)
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('PORT must be an integer between 1 and 65535')
  }
  return port
}

export const env = Object.freeze({
  port: getPort(),
  slackBotToken: requireEnv('SLACK_BOT_TOKEN'),
  slackSigningSecret: requireEnv('SLACK_SIGNING_SECRET'),
})
