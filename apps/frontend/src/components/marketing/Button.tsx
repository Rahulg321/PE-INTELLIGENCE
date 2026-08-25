import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { cn } from '~/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'ghost' | 'link'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonRadius = 'pill' | 'rect'

const variantClasses = {
  primary: 'bg-primary text-white hover:bg-primary-focus',
  secondary: 'border border-primary text-primary hover:bg-primary/5',
  dark: 'bg-ink text-white hover:bg-ink-muted-80',
  ghost:
    'text-primary hover:text-primary-focus hover:underline underline-offset-2',
  link: 'text-primary-on-dark hover:text-white',
} satisfies Record<ButtonVariant, string>

const sizeClasses = {
  sm: 'px-3.5 py-1.5 text-[13px]',
  md: 'px-[22px] py-[11px] text-[15px]',
  lg: 'px-7 py-3.5 text-[16px]',
} satisfies Record<ButtonSize, string>

const radiusClasses = {
  pill: 'rounded-full',
  rect: 'rounded-[8px]',
} satisfies Record<ButtonRadius, string>

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  radius?: ButtonRadius
  className?: string
  children: ReactNode
  /** Internal route path */
  to?: string
  /** External or hash href */
  href?: string
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  type?: 'button' | 'submit'
  'aria-label'?: string
  disabled?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  radius = 'pill',
  className,
  children,
  to,
  href,
  onClick,
  type = 'button',
  disabled,
  ...rest
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 font-semibold transition duration-180 active:scale-95 disabled:pointer-events-none disabled:opacity-50',
    variantClasses[variant],
    sizeClasses[size],
    radiusClasses[radius],
    className,
  )

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick} {...rest}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        aria-disabled={disabled}
        {...rest}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
}
