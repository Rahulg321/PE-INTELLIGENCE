import { Checkbox } from '#/components/ui/checkbox'

export function ToggleChip({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label
      className={`flex cursor-pointer select-none items-center gap-2.5 rounded-full border border-hairline bg-card px-5 py-2.5 text-sm transition-colors ${
        checked ? 'border-primary bg-primary/5 text-primary' : 'hover:border-ink-48'
      }`}
    >
      <Checkbox checked={checked} onCheckedChange={onChange} />
      {label}
    </label>
  )
}
