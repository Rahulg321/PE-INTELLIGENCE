import '@repo/env/load';
import { betterAuth } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { authOptions } from '@repo/auth'

export const auth = betterAuth({
  ...authOptions,
  plugins: [...(authOptions.plugins ?? []), tanstackStartCookies()],
})
