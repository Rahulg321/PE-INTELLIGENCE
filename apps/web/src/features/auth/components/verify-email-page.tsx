import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { verifyEmail } from '../client'
import { Spinner } from '#/components/ui/spinner'

type Status = 'verifying' | 'success' | 'error'

export function VerifyEmailPage({
  token,
  callbackURL,
}: {
  token: string | undefined
  callbackURL: string | undefined
}) {
  const [status, setStatus] = useState<Status>('verifying')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setError('This verification link is missing its token.')
      setStatus('error')
      return
    }

    let cancelled = false
    void verifyEmail({ query: { token } })
      .then(({ error: verifyError }) => {
        if (cancelled) return
        if (verifyError) {
          setError(verifyError.message ?? 'This link is invalid or has expired.')
          setStatus('error')
          return
        }
        setStatus('success')
        window.location.assign(callbackURL ?? '/dashboard')
      })
      .catch(() => {
        if (cancelled) return
        setError('Something went wrong while verifying your email. Please try again.')
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [token, callbackURL])

  if (status === 'verifying') {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-[34px] font-semibold leading-[1.47] tracking-[-0.374px]">
            Verifying your email
          </h1>
          <p className="mt-2 text-[17px] leading-[1.47] tracking-[-0.374px] text-muted-foreground">
            One moment…
          </p>
        </div>
        <Spinner />
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-[34px] font-semibold leading-[1.47] tracking-[-0.374px]">
            Email verified
          </h1>
          <p className="mt-2 text-[17px] leading-[1.47] tracking-[-0.374px] text-muted-foreground">
            Taking you in…
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[34px] font-semibold leading-[1.47] tracking-[-0.374px]">
          Link invalid or expired
        </h1>
        <p className="mt-2 text-[17px] leading-[1.47] tracking-[-0.374px] text-muted-foreground">
          {error ?? 'Please try again with a fresh link.'}
        </p>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        <Link to="/login" className="text-primary no-underline hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
