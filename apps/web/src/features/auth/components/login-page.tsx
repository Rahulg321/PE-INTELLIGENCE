import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { authClient } from '../client'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

export function LoginPage({ resetSuccess = false }: { resetSuccess?: boolean }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  const canSubmit = email.trim() !== '' && password !== ''

  const submit = async () => {
    if (!canSubmit) return
    setPending(true)
    setError(null)
    setUnverifiedEmail(null)
    setResent(false)
    const { error: signInError } = await authClient.signIn.email({
      email: email.trim(),
      password,
      callbackURL: `${window.location.origin}/dashboard`,
    })
    if (signInError) {
      if ((signInError as { code?: string }).code === 'EMAIL_NOT_VERIFIED') {
        setUnverifiedEmail(email.trim())
      } else {
        setError(signInError.message ?? 'Unable to sign in')
      }
      setPending(false)
    }
  }

  const resendVerification = async () => {
    if (!unverifiedEmail) return
    setResending(true)
    setError(null)
    setResent(false)
    const { error: sendError } = await authClient.sendVerificationEmail({
      email: unverifiedEmail,
      callbackURL: `${window.location.origin}/dashboard`,
    })
    setResending(false)
    if (sendError) {
      setError(sendError.message ?? 'Unable to resend the verification email')
    } else {
      setResent(true)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[34px] font-semibold leading-[1.47] tracking-[-0.374px]">
          Sign in
        </h1>
        <p className="mt-2 text-[17px] leading-[1.47] tracking-[-0.374px] text-muted-foreground">
          Sign in to start screening deals.
        </p>
      </div>

      {resetSuccess && (
        <p className="rounded-md border border-hairline bg-card px-4 py-3 text-sm">
          Password updated. Sign in with your new password.
        </p>
      )}

      {unverifiedEmail && (
        <div className="rounded-md border border-hairline bg-card px-4 py-3">
          <p className="text-sm">
            Please verify <span className="font-medium">{unverifiedEmail}</span>{' '}
            before signing in. We&apos;ve emailed you a new link.
          </p>
          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto px-0 py-1"
            disabled={resending}
            onClick={() => void resendVerification()}
          >
            {resent
              ? 'Verification email sent — check your inbox'
              : resending
                ? 'Sending…'
                : 'Resend verification email'}
          </Button>
        </div>
      )}

      <div className="space-y-4">
        <Button
          className="w-full"
          variant="outline"
          onClick={() =>
            void authClient.signIn.social({
              provider: 'google',
              callbackURL: `${window.location.origin}/dashboard`,
            })
          }
        >
          Continue with Google
        </Button>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-hairline" />
          or
          <span className="h-px flex-1 bg-hairline" />
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            void submit()
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-xs font-semibold tracking-[-0.224px]">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@firm.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-semibold tracking-[-0.224px]">
                Password
              </Label>
              <Link
                to="/forgot-password"
                className="text-xs text-primary no-underline hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={!canSubmit || pending}>
            {pending ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="text-primary no-underline hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
