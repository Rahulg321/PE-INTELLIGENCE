import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { getCompanies } from '#/features/companies/server/queries/get-companies'
import { getContacts } from '../server/queries/get-contacts'
import { createContact } from '../server/mutations/create-contact'
import type { ContactSheetTab } from '../schemas'
import { ContactsDataTable } from './contacts-data-table'
import { ContactSheet } from './contact-sheet'

export function ContactsPage({
  initialContacts,
  contactId,
  tab,
}: {
  initialContacts: Awaited<ReturnType<typeof getContacts>>
  contactId?: string
  tab?: ContactSheetTab
}) {
  const navigate = useNavigate({ from: '/contacts' })
  const queryClient = useQueryClient()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [title, setTitle] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [createOpen, setCreateOpen] = useState(false)

  const openContact = (id: string) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        contactId: id,
        tab: prev.tab ?? 'overview',
      }),
    })
  }

  const closeContact = () => {
    void navigate({
      search: (prev) => ({
        ...prev,
        contactId: undefined,
        tab: undefined,
      }),
    })
  }

  const setTab = (next: ContactSheetTab) => {
    void navigate({
      search: (prev) => ({ ...prev, tab: next }),
      replace: true,
    })
  }

  const contactsQuery = useQuery({
    queryKey: ['contacts'],
    queryFn: () => getContacts(),
    initialData: initialContacts,
  })

  const companiesQuery = useQuery({
    queryKey: ['companies'],
    queryFn: () => getCompanies(),
    enabled: createOpen,
  })

  const createMutation = useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      setFirstName('')
      setLastName('')
      setTitle('')
      setEmail('')
      setPhone('')
      setCompanyId('')
      setCreateOpen(false)
      void queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })

  const contacts = contactsQuery.data

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!firstName.trim() || !companyId) return
    createMutation.mutate({
      data: {
        firstName,
        lastName: lastName || undefined,
        title: title || undefined,
        email: email || undefined,
        phone: phone || undefined,
        companyId,
      },
    })
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-2 py-6 md:px-4 md:py-8">
      <ContactsDataTable
        data={contacts}
        onRowClick={openContact}
        onCreateClick={() => setCreateOpen(true)}
      />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New contact</DialogTitle>
            <DialogDescription>
              Add a person at one of your companies.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="contact-first-name">First name</Label>
                <Input
                  id="contact-first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jane"
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="contact-last-name">Last name</Label>
                <Input
                  id="contact-last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact-title">Title</Label>
              <Input
                id="contact-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Chief Financial Officer"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@acme.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact-phone">Phone</Label>
              <Input
                id="contact-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact-company">Company</Label>
              <Select
                value={companyId}
                onValueChange={setCompanyId}
                disabled={companiesQuery.isPending}
              >
                <SelectTrigger id="contact-company">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Companies</SelectLabel>
                    {(companiesQuery.data ?? []).map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.displayName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {createMutation.isError && (
              <p className="text-sm text-destructive">
                Could not create contact: {createMutation.error.message}
              </p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  createMutation.isPending || !firstName.trim() || !companyId
                }
              >
                Add contact
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ContactSheet
        contactId={contactId ?? null}
        tab={tab ?? 'overview'}
        onTabChange={setTab}
        onSelectContact={openContact}
        onClose={closeContact}
      />
    </div>
  )
}
