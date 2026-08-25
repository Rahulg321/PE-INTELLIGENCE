import { useLocation } from '@tanstack/react-router'
import { useState } from 'react'
import { contactFields, type ContactField } from '~/content/contact'
import { demoRequestSchema, type DemoRequest } from '~/lib/contact/schema'
import { requestDemo } from '~/lib/contact/server'
import { track } from '~/lib/analytics'
import { cn } from '~/lib/utils'
import { Button } from './Button'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

const initialValues: DemoRequest = {
  name: '',
  email: '',
  firm: '',
  role: '',
  firmType: '',
  dealVolume: '',
  workflow: '',
  problem: '',
  notes: '',
}

/** Autofill hints per field. `off` avoids password-manager false triggers. */
const autocompleteFor = {
  name: 'name',
  email: 'email',
  firm: 'organization',
  role: 'organization-title',
  firmType: undefined,
  dealVolume: undefined,
  workflow: 'off',
  problem: 'off',
  notes: 'off',
} satisfies Partial<Record<keyof DemoRequest, string>>

export function ContactForm() {
  const pathname = useLocation({ select: (s) => s.pathname })
  const [values, setValues] = useState<DemoRequest>(initialValues)
  const [errors, setErrors] = useState<
    Partial<Record<keyof DemoRequest, string>>
  >({})
  const [status, setStatus] = useState<FormState>('idle')

  function setValue(name: keyof DemoRequest, value: string) {
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) {
      setErrors((e) => ({ ...e, [name]: undefined }))
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'submitting') return

    const result = demoRequestSchema.safeParse(values)
    if (!result.success) {
      const next: Partial<Record<keyof DemoRequest, string>> = {}
      for (const issue of result.error.issues) {
        // SAFETY: the schema is flat, so `path[0]` is the offending field name.
        const key = issue.path[0] as keyof DemoRequest
        if (key && !next[key]) next[key] = issue.message
      }
      setErrors(next)
      const firstError = Object.keys(next)[0]
      if (firstError) {
        document.getElementById(`contact-${firstError}`)?.focus()
      }
      return
    }

    setStatus('submitting')
    try {
      await requestDemo({ data: result.data })
      setStatus('success')
      track('contact_submitted', {
        page: pathname,
        section: 'contact',
        source: 'contact-form',
      })
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        className="rounded-lg border border-success/30 bg-success/5 p-8 text-center"
      >
        <h3 className="font-display text-xl font-semibold text-ink">
          Request received.
        </h3>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-[1.5] text-ink-muted-80">
          Thank you — we&rsquo;ll be in touch. If your firm is evaluating
          platforms now, reply to our note and we&rsquo;ll prioritize your
          walkthrough.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {contactFields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={values[field.name]}
            error={errors[field.name]}
            onChange={(v) => setValue(field.name, v)}
            onFocus={() =>
              track('contact_started', {
                page: pathname,
                section: 'contact',
                source: 'contact-form',
              })
            }
            autocomplete={autocompleteFor[field.name]}
            fullWidth={field.type === 'textarea'}
          />
        ))}
      </div>

      {status === 'error' ? (
        <p role="alert" className="text-[14px] text-danger">
          Something went wrong sending your request. Please try again.
        </p>
      ) : null}

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : 'Request a Demo'}
        </Button>
        <p className="text-[12px] leading-[1.5] text-ink-muted-48">
          We only use your details to respond to your request. No spam, no
          lists.
        </p>
      </div>
    </form>
  )
}

function FormField({
  field,
  value,
  error,
  onChange,
  onFocus,
  autocomplete,
  fullWidth,
}: {
  field: ContactField
  value: string
  error?: string
  onChange: (v: string) => void
  onFocus: () => void
  autocomplete?: string
  fullWidth?: boolean
}) {
  const baseId = `contact-${field.name}`
  const inputClasses = cn(
    'w-full rounded-[8px] border bg-canvas px-3.5 py-2.5 text-[15px] text-ink transition placeholder:text-ink-muted-48 focus:outline-none focus:ring-2 focus:ring-primary-focus/40',
    error ? 'border-danger' : 'border-hairline hover:border-chip',
  )

  return (
    <div className={cn('flex flex-col gap-1.5', fullWidth && 'sm:col-span-2')}>
      <label
        htmlFor={baseId}
        className="text-[13px] font-medium text-ink-muted-80"
      >
        {field.label}
        {field.required ? (
          <span aria-hidden="true" className="text-danger">
            {' '}
            *
          </span>
        ) : null}
      </label>

      {field.type === 'select' ? (
        <select
          id={baseId}
          name={field.name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          className={cn(
            inputClasses,
            'appearance-none',
            !value && 'text-ink-muted-48',
          )}
        >
          <option value="">Select…</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : field.type === 'textarea' ? (
        <textarea
          id={baseId}
          name={field.name}
          value={value}
          placeholder={field.placeholder}
          autoComplete={autocomplete}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          rows={field.name === 'notes' ? 4 : 3}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${baseId}-error` : undefined}
          className={inputClasses}
        />
      ) : (
        <input
          id={baseId}
          name={field.name}
          type={field.type}
          value={value}
          placeholder={field.placeholder}
          autoComplete={autocomplete}
          spellCheck={field.type === 'email' ? false : undefined}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${baseId}-error` : undefined}
          className={inputClasses}
        />
      )}

      {error ? (
        <p
          id={`${baseId}-error`}
          role="alert"
          className="text-[12px] text-danger"
        >
          {error}
        </p>
      ) : null}
    </div>
  )
}
