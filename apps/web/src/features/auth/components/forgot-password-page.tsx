import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { requestPasswordReset } from '../client'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [sent, setSent] = useState(false)

  const canSubmit = email.trim() !== ''

  const submit = async () => {
    if (!canSubmit) return
    setPending(true)
    setError(null)
    const { error: resetError } = await requestPasswordReset({
      email: email.trim(),
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (resetError) {
      setError(resetError.message ?? 'Unable to send the reset link')
      setPending(false)
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-[34px] font-semibold leading-[1.47] tracking-[-0.374px]">
            Check your email
          </h1>
          <p className="mt-2 text-[17px] leading-[1.47] tracking-[-0.374px] text-muted-foreground">
            If an account exists for {email.trim()}, we&apos;ve sent a link to
            reset your password. The link expires in one hour.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            type="button"
            className="w-full"
            variant="outline"
            disabled={pending}
            onClick={() => {
              setPending(true)
              void requestPasswordReset({
                email: email.trim(),
                redirectTo: `${window.location.origin}/reset-password`,
              }).then(() => setPending(false))
            }}
          >
            {pending ? 'Sending…' : 'Resend the email'}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Remembered it?{' '}
          <Link to="/login" className="text-primary no-underline hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[34px] font-semibold leading-[1.47] tracking-[-0.374px]">
          Forgot your password?
        </h1>
        <p className="mt-2 text-[17px] leading-[1.47] tracking-[-0.374px] text-muted-foreground">
          Enter the email you signed up with and we&apos;ll send you a reset link.
        </p>
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

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full" disabled={!canSubmit || pending}>
          {pending ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{' '}
        <Link to="/login" className="text-primary no-underline hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
