import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { AlertTriangle } from 'lucide-react'
import { Button } from '#/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/components/ui/alert-dialog'
import { Input } from '#/components/ui/input'
import { Spinner } from '#/components/ui/spinner'
import { deleteWorkspace } from '#/features/workspaces/server/mutations/delete-workspace'

export function DeleteWorkspaceZone({
  workspaceId,
  workspaceName,
}: {
  workspaceId: string
  workspaceName: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [confirmation, setConfirmation] = useState('')

  const deleteMutation = useMutation({
    mutationFn: deleteWorkspace,
    onSuccess: async ({ remainingCount }) => {
      await router.invalidate()
      if (remainingCount > 0) {
        await router.navigate({ to: '/dashboard' })
      } else {
        await router.navigate({ to: '/onboarding' })
      }
    },
  })

  const close = () => {
    setOpen(false)
    setConfirmation('')
  }

  const confirm = () => {
    deleteMutation.mutate({ data: { workspaceId } })
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold tracking-[-0.02em]">
            Danger zone
          </h2>
          <p className="text-sm text-muted-foreground">
            Permanently delete this workspace and everything in it. This cannot
            be undone.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 rounded-lg border border-destructive/30 bg-card p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
          <div className="text-sm">
            <p className="font-medium">Delete {workspaceName}</p>
            <p className="text-muted-foreground">
              Companies, contacts, deals, financials, your investment mandate,
              and agent history will be removed.
            </p>
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setOpen(true)}
          className="shrink-0"
        >
          Delete workspace
        </Button>
      </div>

      <AlertDialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) setConfirmation('')
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {workspaceName}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the workspace and all of its data:
              companies, contacts, financial periods, deals and deal economics,
              the investment mandate, and agent task history. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-2">
            <label
              htmlFor="delete-workspace-confirm"
              className="text-sm font-medium"
            >
              Type{' '}
              <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                {workspaceName}
              </span>{' '}
              to confirm
            </label>
            <Input
              id="delete-workspace-confirm"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              autoComplete="off"
              placeholder={workspaceName}
            />
          </div>
          {deleteMutation.isError ? (
            <p className="text-sm text-destructive">
              Could not delete workspace: {deleteMutation.error.message}
            </p>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending} onClick={close}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteMutation.isPending || confirmation !== workspaceName}
              onClick={(event) => {
                event.preventDefault()
                confirm()
              }}
            >
              {deleteMutation.isPending && (
                <Spinner data-icon="inline-start" />
              )}
              Delete workspace
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
