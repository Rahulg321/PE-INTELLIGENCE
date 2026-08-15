import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { authClient } from '#/features/auth/client'
import type { OnboardingStepProps } from './onboarding-wizard'

export function CreateWorkspaceStep({ form, onChange }: OnboardingStepProps) {
  const { data: session } = authClient.useSession()

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[17px] font-semibold leading-[1.24] tracking-[-0.374px]">
          Let's set up your investment workspace.
        </p>
        <p className="mt-1 text-sm leading-[1.47] text-muted-foreground">
          We'll use this to personalize deal screening for your firm.
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="workspace-name" className="text-xs font-semibold tracking-[-0.224px]">
          Workspace / firm name
        </Label>
        <Input
          id="workspace-name"
          value={form.firmName}
          onChange={(e) => onChange({ firmName: e.target.value })}
          placeholder="Dark Alpha Capital"
          autoFocus
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="workspace-website" className="text-xs font-semibold tracking-[-0.224px]">
          Website <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="workspace-website"
          value={form.website}
          onChange={(e) => onChange({ website: e.target.value })}
          placeholder="https://darkalphacapital.com"
        />
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-hairline bg-card p-4">
        {session?.user.image ? (
          <img
            src={session.user.image}
            alt=""
            className="size-10 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-10 items-center justify-center rounded-full bg-muted font-semibold">
            {(session?.user.name ?? 'U').charAt(0).toUpperCase()}
          </span>
        )}
        <div>
          <p className="text-[15px] font-semibold leading-[1.24] tracking-[-0.224px]">
            {session?.user.name}
          </p>
          <p className="text-sm text-muted-foreground">{session?.user.email}</p>
        </div>
      </div>
    </div>
  )
}
