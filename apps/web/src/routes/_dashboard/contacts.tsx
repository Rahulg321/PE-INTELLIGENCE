import { createFileRoute } from '@tanstack/react-router'
import { ContactsPage } from '#/features/contacts/components/contacts-page'
import { contactsSearchSchema } from '#/features/contacts/schemas'
import { getContacts } from '#/features/contacts/server/queries/get-contacts'

export const Route = createFileRoute('/_dashboard/contacts')({
  component: ContactsRoute,
  validateSearch: contactsSearchSchema,
  loader: async () => getContacts(),
})

function ContactsRoute() {
  const initialContacts = Route.useLoaderData()
  const { contactId, tab } = Route.useSearch()
  return (
    <ContactsPage
      initialContacts={initialContacts}
      contactId={contactId}
      tab={tab}
    />
  )
}
