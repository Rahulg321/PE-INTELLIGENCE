import { describe, expect, test } from 'bun:test'

import { getReply } from './replies'

describe('getReply', () => {
  test('returns help', () => {
    expect(getReply('Can you HELP me?').markdown).toContain('Chat SDK demo')
  })

  test('returns status', () => {
    expect(getReply('status').markdown).toContain('running')
  })

  test('returns usage guidance for other messages', () => {
    expect(getReply('hello').markdown).toContain('Try `help` or `status`')
  })
})
