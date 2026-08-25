import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  authClient,
  changePassword,
  listAccounts,
  sendVerificationEmail,
  unlinkAccount,
} from '#/features/auth/client'
import { Button } from '#/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Spinner } from '#/components/ui/spinner'
import { cn } from '#/lib/utils'
import { SettingsSection } from './settings-section'

const PROVIDER_LABELS: Record<string, string> = {
  credential: 'Email & password',
  google: 'Google',
}

function providerLabel(providerId: string): string {
  return PROVIDER_LABELS[providerId] ?? providerId
}

export function SecuritySettingsPage() {
  const queryClient = useQueryClient()
  const { data: session } = authClient.useSession()
  const user = session?.user

  const accountsQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const { data } = await listAccounts()
      return data ?? []
    },
  })
  const accounts = accountsQuery.data ?? []

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  const [resent, setResent] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendError, setResendError] = useState<string | null>(null)

  const canChangePassword =
    currentPassword !== '' &&
    newPassword !== '' &&
    newPassword === confirmPassword

  const changePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!canChangePassword) return
    setChangingPassword(true)
    setPasswordError(null)
    setPasswordSaved(false)
    const { error: changeError } = await changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    })
    setChangingPassword(false)
    if (changeError) {
      setPasswordError(changeError.message ?? 'Unable to change your password')
      return
    }
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setPasswordSaved(true)
  }

  const resendVerification = async () => {
    if (!user) return
    setResending(true)
    setResent(false)
    setResendError(null)
    const { error: sendError } = await sendVerificationEmail({
      email: user.email,
      callbackURL: `${window.location.origin}/settings/security`,
    })
    setResending(false)
    if (sendError) {
      setResendError(sendError.message ?? 'Unable to send the verification email')
      return
    }
    setResent(true)
  }

  const unlink = async (providerId: string) => {
    const { error: unlinkError } = await unlinkAccount({ providerId })
    if (!unlinkError) {
      await queryClient.invalidateQueries({ queryKey: ['accounts'] })
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">Security</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your password, email verification, and sign-in methods.
        </p>
      </div>

      <form onSubmit={changePasswordSubmit}>
        <SettingsSection
          title="Change password"
          description="Use a strong password you don&apos;t use anywhere else."
          action={
            <Button
              type="submit"
              size="sm"
              disabled={changingPassword || !canChangePassword}
            >
              {changingPassword ? <Spinner /> : null}
              Update password
            </Button>
          }
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="current-password">Current password</FieldLabel>
              <Input
                id="current-password"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="new-password">New password</FieldLabel>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
              <FieldDescription>
                Signing in from your other devices will be required after you
                change it.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-new-password">
                Confirm new password
              </FieldLabel>
              <Input
                id="confirm-new-password"
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </Field>
            {passwordError && (
              <p className="text-sm text-destructive">{passwordError}</p>
            )}
            {newPassword !== '' &&
              confirmPassword !== '' &&
              newPassword !== confirmPassword && (
                <p className="text-sm text-destructive">
                  Passwords do not match.
                </p>
              )}
            {passwordSaved && (
              <p className="text-sm text-primary">Password updated.</p>
            )}
          </FieldGroup>
        </SettingsSection>
      </form>

      <SettingsSection
        title="Email"
        description="Your email address and verification status."
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">{user?.email}</span>
            <span
              className={cn(
                'flex items-center gap-1.5 text-sm text-muted-foreground',
              )}
            >
              <span
                className={cn(
                  'size-2 rounded-full',
                  user?.emailVerified ? 'bg-primary' : 'bg-muted-foreground',
                )}
              />
              {user?.emailVerified ? 'Verified' : 'Not verified'}
            </span>
          </div>
          {user && !user.emailVerified ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={resending}
              onClick={() => void resendVerification()}
            >
              {resending ? <Spinner /> : null}
              {resent ? 'Sent' : 'Resend verification email'}
            </Button>
          ) : null}
        </div>
        {resendError && <p className="mt-3 text-sm text-destructive">{resendError}</p>}
      </SettingsSection>

      <SettingsSection
        title="Sign-in methods"
        description="The ways you can sign in to this account."
      >
        {accountsQuery.isLoading ? (
          <Spinner />
        ) : (
          <ul className="flex flex-col gap-2">
            {accounts.map((account) => (
              <li
                key={account.providerId}
                className="flex items-center justify-between gap-4 rounded-md border border-hairline px-3 py-2"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">
                    {providerLabel(account.providerId)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {account.providerId === 'credential'
                      ? user?.email
                      : account.accountId}
                  </span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  disabled={accounts.length <= 1}
                  onClick={() => void unlink(account.providerId)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </SettingsSection>
    </div>
  )
}
