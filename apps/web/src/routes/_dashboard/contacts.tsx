import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/contacts')({
  component: ContactsRoute,
})

function ContactsRoute() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <span className="kicker">Contacts</span>
      <h1 className="mt-3 text-[40px] font-semibold leading-[1.1]">Contacts</h1>
    </div>
  )
}
