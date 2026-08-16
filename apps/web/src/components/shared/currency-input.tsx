import { useLayoutEffect, useRef  } from 'react'
import type {ComponentProps} from 'react';
import { Input } from '#/components/ui/input'
import { formatUsdInteger, parseUsdDigits } from '#/lib/format-money'

type CurrencyInputProps = Omit<
  ComponentProps<typeof Input>,
  'type' | 'value' | 'onChange' | 'inputMode' | 'ref'
> & {
  value: string
  onValueChange: (digits: string) => void
}

function cursorFromDigitCount(formatted: string, digitCount: number): number {
  let pos = 0
  let seen = 0
  while (pos < formatted.length && seen < digitCount) {
    if (formatted[pos] !== ',') seen += 1
    pos += 1
  }
  return pos
}

export function CurrencyInput({
  value,
  onValueChange,
  ...props
}: CurrencyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const cursorRef = useRef<number | null>(null)

  useLayoutEffect(() => {
    const el = inputRef.current
    const pos = cursorRef.current
    if (!el || pos == null) return
    el.setSelectionRange(pos, pos)
    cursorRef.current = null
  })

  return (
    <Input
      {...props}
      ref={inputRef}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      spellCheck={false}
      value={formatUsdInteger(value)}
      onChange={(event) => {
        const el = event.target
        const cursor = el.selectionStart ?? el.value.length
        const digitsBeforeCursor = parseUsdDigits(el.value.slice(0, cursor)).length
        const digits = parseUsdDigits(el.value)
        cursorRef.current = cursorFromDigitCount(
          formatUsdInteger(digits),
          digitsBeforeCursor,
        )
        onValueChange(digits)
      }}
    />
  )
}
