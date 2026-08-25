import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Spinner } from '#/components/ui/spinner'
import { cn } from '#/lib/utils'
import {
  CONTEXT_API_SIGNUP_URL,
  RESEARCH_MODELS,
  isResearchModelId,
} from '../constants'
import { DeleteWorkspaceZone } from './delete-workspace-zone'
import { SettingsSection } from './settings-section'
import { updateContextKey } from '../server/mutations/update-context-key'
import { updateResearchModel } from '../server/mutations/update-research-model'
import { updateWorkspace } from '../server/mutations/update-workspace'
import { getSettings } from '../server/queries/get-settings'

export function GeneralSettingsPage({
  initialSettings,
}: {
  initialSettings: Awaited<ReturnType<typeof getSettings>>
}) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const settingsQuery = useQuery({
    queryKey: ['settings'],
    queryFn: () => getSettings(),
    initialData: initialSettings,
  })
  const settings = settingsQuery.data

  const [name, setName] = useState(settings.workspace.name)
  const [website, setWebsite] = useState(settings.workspace.website)
  const [contextKey, setContextKey] = useState('')

  useEffect(() => {
    setName(settings.workspace.name)
    setWebsite(settings.workspace.website)
  }, [settings.workspace.id, settings.workspace.name, settings.workspace.website])

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['settings'] })
    await router.invalidate()
  }

  const workspaceMutation = useMutation({
    mutationFn: updateWorkspace,
    onSuccess: () => void refresh(),
  })

  const contextMutation = useMutation({
    mutationFn: updateContextKey,
    onSuccess: () => {
      setContextKey('')
      void refresh()
    },
  })

  const modelMutation = useMutation({
    mutationFn: updateResearchModel,
    onSuccess: () => void refresh(),
  })

  const saveWorkspace = (event: React.FormEvent) => {
    event.preventDefault()
    workspaceMutation.mutate({ data: { name, website: website || undefined } })
  }

  const saveContextKey = (event: React.FormEvent) => {
    event.preventDefault()
    if (!contextKey.trim()) return
    contextMutation.mutate({ data: { key: contextKey } })
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">General</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Who you are, and the model the research agent thinks with.
        </p>
      </div>

      <form onSubmit={saveWorkspace}>
        <SettingsSection
          title="Workspace"
          description="The name and website of the company using this CRM."
          action={
            <Button
              type="submit"
              size="sm"
              disabled={workspaceMutation.isPending || !name.trim()}
            >
              {workspaceMutation.isPending ? <Spinner /> : null}
              Save
            </Button>
          }
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="workspace-name">Name</FieldLabel>
              <Input
                id="workspace-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="organization"
              />
              <FieldDescription>
                Shown wherever the CRM refers to your own company.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="workspace-website">Website</FieldLabel>
              <Input
                id="workspace-website"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                placeholder="https://acme.com"
              />
              <FieldDescription>
                Your own company&apos;s website. Only an owner or an admin can
                change this.
              </FieldDescription>
            </Field>
            {workspaceMutation.isError ? (
              <p className="text-sm text-destructive">
                Could not save workspace: {workspaceMutation.error.message}
              </p>
            ) : null}
          </FieldGroup>
        </SettingsSection>
      </form>

      <form onSubmit={saveContextKey}>
        <SettingsSection
          title="Company research"
          description="Enter your Context API key so our agents can research every company in the CRM."
          action={
            <Button
              type="submit"
              size="sm"
              disabled={contextMutation.isPending || !contextKey.trim()}
            >
              {contextMutation.isPending ? <Spinner /> : null}
              Save key
            </Button>
          }
        >
          <FieldGroup>
            <Field>
              <div className="flex items-center justify-between gap-3">
                <FieldLabel htmlFor="context-api-key">Context API key</FieldLabel>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span
                    className={cn(
                      'size-2 rounded-full',
                      settings.contextApiConnected
                        ? 'bg-primary'
                        : 'bg-muted-foreground',
                    )}
                  />
                  {settings.contextApiConnected ? 'Connected' : 'Not connected'}
                </span>
              </div>
              <Input
                id="context-api-key"
                type="password"
                autoComplete="off"
                value={contextKey}
                onChange={(event) => setContextKey(event.target.value)}
                placeholder="Paste the key"
              />
              <FieldDescription>
                Don&apos;t have a Context API key?{' '}
                <a
                  href={CONTEXT_API_SIGNUP_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Sign up here
                </a>
              </FieldDescription>
            </Field>
            {contextMutation.isError ? (
              <p className="text-sm text-destructive">
                Could not save key: {contextMutation.error.message}
              </p>
            ) : null}
          </FieldGroup>
        </SettingsSection>
      </form>

      <SettingsSection
        title="Research agent"
        description="The model the agent thinks with, routed through the Vercel AI Gateway."
      >
        <Select
          value={settings.researchModel}
          onValueChange={(value) => {
            if (value === settings.researchModel) return
            if (!isResearchModelId(value)) return
            modelMutation.mutate({
              data: { model: value },
            })
          }}
          disabled={modelMutation.isPending}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a model" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {RESEARCH_MODELS.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {modelMutation.isError ? (
          <p className="mt-3 text-sm text-destructive">
            Could not save model: {modelMutation.error.message}
          </p>
        ) : null}
      </SettingsSection>

      <DeleteWorkspaceZone
        workspaceId={settings.workspace.id}
        workspaceName={settings.workspace.name}
      />
    </div>
  )
}
