import { eq } from 'drizzle-orm'
import { contacts, db } from 'db'
import { workspacesService } from '#/features/workspaces/server/workspaces-service'
import type { CreateContactInput } from '../schemas'

const randomId = () => crypto.randomUUID()

export const contactsService = {
  async create(userId: string, input: CreateContactInput) {
    const { activeWorkspaceId } = await workspacesService.list(userId)
    if (!activeWorkspaceId) throw new Error('No workspace selected')

    const company = await db.query.companies.findFirst({
      where: { id: input.companyId, workspaceId: activeWorkspaceId },
      columns: { id: true },
    })
    if (!company) throw new Error('Company not found in this workspace')

    const contactId = randomId()
    await db.insert(contacts).values({
      id: contactId,
      companyId: input.companyId,
      firstName: input.firstName.trim(),
      lastName: input.lastName?.trim() || null,
      title: input.title?.trim() || null,
      email: input.email?.trim() || null,
      phone: input.phone?.trim() || null,
    })

    return { id: contactId }
  },

  async list(userId: string) {
    const { activeWorkspaceId } = await workspacesService.list(userId)
    if (!activeWorkspaceId) return []

    const companies = await db.query.companies.findMany({
      where: { workspaceId: activeWorkspaceId },
      columns: {
        id: true,
        displayName: true,
        logoUrl: true,
      },
      with: { contacts: true },
      orderBy: { createdAt: 'desc' },
    })

    return companies.flatMap((company) =>
      company.contacts.map((contact) => ({
        ...contact,
        company: {
          id: company.id,
          displayName: company.displayName,
          logoUrl: company.logoUrl,
        },
      })),
    )
  },

  async get(userId: string, contactId: string) {
    const { activeWorkspaceId } = await workspacesService.list(userId)
    if (!activeWorkspaceId) return null

    const contact = await db.query.contacts.findFirst({
      where: { id: contactId },
    })
    if (!contact) return null

    const company = await db.query.companies.findFirst({
      where: { id: contact.companyId, workspaceId: activeWorkspaceId },
      with: {
        contacts: true,
        deals: true,
      },
    })
    if (!company) return null

    const [openTasks, events] = await Promise.all([
      db.query.agentTasks.findMany({
        where: {
          entityId: company.id,
          finishedAt: { isNull: true },
        },
        columns: { id: true, kind: true },
      }),
      db.query.agentEvents.findMany({
        where: {
          workspaceId: activeWorkspaceId,
          entityId: contactId,
        },
        columns: { id: true, kind: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        limit: 50,
      }),
    ])

    return { contact, company, events, enriching: openTasks.length > 0 }
  },

  async setPrimary(userId: string, contactId: string) {
    const data = await this.get(userId, contactId)
    if (!data) throw new Error('Contact not found')

    await db.transaction(async (tx) => {
      await tx
        .update(contacts)
        .set({ isPrimary: false })
        .where(eq(contacts.companyId, data.company.id))
      await tx
        .update(contacts)
        .set({ isPrimary: true })
        .where(eq(contacts.id, contactId))
    })

    return { ok: true as const }
  },
}
