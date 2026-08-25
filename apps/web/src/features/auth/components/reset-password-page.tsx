import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { resetPassword } from '../client'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

export function ResetPasswordPage({ token }: { token: string }) {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const canSubmit = password !== '' && password === confirmPassword

  const submit = async () => {
    if (!canSubmit) return
    setPending(true)
    setError(null)
    const { error: resetError } = await resetPassword({
      newPassword: password,
      token,
    })
    if (resetError) {
      setError(resetError.message ?? 'Unable to reset your password')
      setPending(false)
      return
    }
    await navigate({ to: '/login', search: { reset: 'success' } })
  }

  if (!token) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-[34px] font-semibold leading-[1.47] tracking-[-0.374px]">
            Invalid link
          </h1>
          <p className="mt-2 text-[17px] leading-[1.47] tracking-[-0.374px] text-muted-foreground">
            This password reset link is missing its token. Request a new one
            below.
          </p>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          <Link to="/forgot-password" className="text-primary no-underline hover:underline">
            Request a new reset link
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[34px] font-semibold leading-[1.47] tracking-[-0.374px]">
          Set a new password
        </h1>
        <p className="mt-2 text-[17px] leading-[1.47] tracking-[-0.374px] text-muted-foreground">
          Choose a strong password you haven&apos;t used elsewhere.
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
          <Label htmlFor="password" className="text-xs font-semibold tracking-[-0.224px]">
            New password
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm-password" className="text-xs font-semibold tracking-[-0.224px]">
            Confirm new password
          </Label>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {password !== '' && confirmPassword !== '' && password !== confirmPassword && (
          <p className="text-sm text-destructive">Passwords do not match.</p>
        )}

        <Button type="submit" className="w-full" disabled={!canSubmit || pending}>
          {pending ? 'Resetting…' : 'Reset password'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        <Link to="/login" className="text-primary no-underline hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
