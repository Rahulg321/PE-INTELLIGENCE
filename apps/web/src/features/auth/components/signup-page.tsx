import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { authClient } from '../client'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

export function SignupPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const canSubmit =
    name.trim() !== '' &&
    email.trim() !== '' &&
    password !== '' &&
    password === confirmPassword

  const submit = async () => {
    if (!canSubmit) return
    setPending(true)
    setError(null)
    const { error: signUpError } = await authClient.signUp.email({
      name: name.trim(),
      email: email.trim(),
      password,
      callbackURL: '/onboarding',
    })
    if (signUpError) {
      setError(signUpError.message ?? 'Unable to create your account')
      setPending(false)
      return
    }
    await navigate({ to: '/onboarding' })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[34px] font-semibold leading-[1.47] tracking-[-0.374px]">
          Create your account
        </h1>
        <p className="mt-2 text-[17px] leading-[1.47] tracking-[-0.374px] text-muted-foreground">
          Set up your workspace in under a minute.
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
          <Label htmlFor="name" className="text-xs font-semibold tracking-[-0.224px]">
            Name
          </Label>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
          <Label htmlFor="password" className="text-xs font-semibold tracking-[-0.224px]">
            Password
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
            Confirm password
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

        <Button type="submit" className="w-full" size="lg" disabled={!canSubmit || pending}>
          {pending ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="text-primary no-underline hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
