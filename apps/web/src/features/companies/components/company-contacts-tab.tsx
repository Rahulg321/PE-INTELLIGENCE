import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Star, Users } from 'lucide-react'
import { Avatar, AvatarFallback } from '#/components/ui/avatar'
import { Button } from '#/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '#/components/ui/empty'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Spinner } from '#/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { cn } from '#/lib/utils'
import { createContact } from '#/features/contacts/server/mutations/create-contact'
import type { getCompany } from '../server/queries/get-company'

type Contact = NonNullable<
  Awaited<ReturnType<typeof getCompany>>
>['company']['contacts'][number]

export function CompanyContactsTab({
  companyId,
  contacts,
  adding,
  onAddingChange,
}: {
  companyId: string
  contacts: Contact[]
  adding: boolean
  onAddingChange: (open: boolean) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      {adding && (
        <AddContactForm
          companyId={companyId}
          onCancel={() => onAddingChange(false)}
        />
      )}

      {contacts.length === 0 && !adding ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users />
            </EmptyMedia>
            <EmptyTitle>No contacts</EmptyTitle>
            <EmptyDescription>
              No people are linked to this company yet.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => onAddingChange(true)}>
              <Plus data-icon="inline-start" />
              Add contact
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          {contacts.length > 0 && <ContactsTable contacts={contacts} />}
          {!adding && (
            <Button
              variant="ghost"
              size="sm"
              className="self-start"
              onClick={() => onAddingChange(true)}
            >
              <Plus data-icon="inline-start" />
              Add contact
            </Button>
          )}
        </>
      )}
    </div>
  )
}

function AddContactForm({
  companyId,
  onCancel,
}: {
  companyId: string
  onCancel: () => void
}) {
  const queryClient = useQueryClient()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [title, setTitle] = useState('')

  const createMutation = useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      setFirstName('')
      setLastName('')
      setEmail('')
      setTitle('')
      onCancel()
      void queryClient.invalidateQueries({ queryKey: ['company', companyId] })
      void queryClient.invalidateQueries({ queryKey: ['companies'] })
      void queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!firstName.trim()) return
    createMutation.mutate({
      data: {
        firstName,
        lastName: lastName || undefined,
        email: email || undefined,
        title: title || undefined,
        companyId,
      },
    })
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-4 rounded-lg border p-4"
    >
      <FieldGroup className="gap-4">
        <FieldGroup className="grid grid-cols-2 gap-3">
          <Field>
            <FieldLabel htmlFor="sheet-contact-first-name">First name</FieldLabel>
            <Input
              id="sheet-contact-first-name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="Jane"
              autoFocus
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="sheet-contact-last-name">Last name</FieldLabel>
            <Input
              id="sheet-contact-last-name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder="Doe"
            />
          </Field>
        </FieldGroup>
        <FieldGroup className="grid grid-cols-2 gap-3">
          <Field>
            <FieldLabel htmlFor="sheet-contact-email">Email</FieldLabel>
            <Input
              id="sheet-contact-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="jane@acme.com"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="sheet-contact-title">Title</FieldLabel>
            <Input
              id="sheet-contact-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Head of Security"
            />
          </Field>
        </FieldGroup>
      </FieldGroup>
      {createMutation.isError && (
        <FieldError>{createMutation.error.message}</FieldError>
      )}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={createMutation.isPending || !firstName.trim()}
        >
          {createMutation.isPending && <Spinner data-icon="inline-start" />}
          Add contact
        </Button>
      </div>
    </form>
  )
}

function ContactsTable({ contacts }: { contacts: Contact[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Name</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact) => {
          const name = [contact.firstName, contact.lastName]
            .filter(Boolean)
            .join(' ')
          return (
            <TableRow key={contact.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Star
                    className={cn(
                      contact.isPrimary
                        ? 'fill-foreground text-foreground'
                        : 'text-muted-foreground',
                    )}
                  />
                  <Avatar size="sm">
                    <AvatarFallback>{initials(name)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{name}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {contact.title ?? '—'}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {contact.email ?? '—'}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}
