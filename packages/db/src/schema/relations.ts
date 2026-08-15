import { defineRelations } from "drizzle-orm";
import { users, sessions, accounts, verifications, rateLimits } from "./auth";
import { workspaces, investmentMandates, mandateSectors, mandateCriteria } from "./workspaces";
import { companies, contacts, companyFinancialPeriods } from "./companies";
import { deals, dealEconomics } from "./deals";
import { onboardingDrafts } from "./onboarding-drafts";

export const relations = defineRelations(
    { users, sessions, accounts, verifications, rateLimits, workspaces, investmentMandates, mandateSectors, mandateCriteria, companies, contacts, companyFinancialPeriods, deals, dealEconomics, onboardingDrafts },
    (helpers) => ({
        users: {
            sessions: helpers.many.sessions({ from: [helpers.users.id], to: [helpers.sessions.userId] }),
            accounts: helpers.many.accounts({ from: [helpers.users.id], to: [helpers.accounts.userId] }),
            workspaces: helpers.many.workspaces({ from: [helpers.users.id], to: [helpers.workspaces.ownerUserId] }),
            onboardingDrafts: helpers.one.onboardingDrafts({ from: [helpers.users.id], to: [helpers.onboardingDrafts.userId] }),
        },
        sessions: {
            users: helpers.one.users({ from: [helpers.sessions.userId], to: [helpers.users.id] }),
        },
        accounts: {
            users: helpers.one.users({ from: [helpers.accounts.userId], to: [helpers.users.id] }),
        },
        workspaces: {
            users: helpers.one.users({ from: [helpers.workspaces.ownerUserId], to: [helpers.users.id] }),
            investmentMandates: helpers.one.investmentMandates({ from: [helpers.workspaces.id], to: [helpers.investmentMandates.workspaceId] }),
            companies: helpers.many.companies({ from: [helpers.workspaces.id], to: [helpers.companies.workspaceId] }),
            deals: helpers.many.deals({ from: [helpers.workspaces.id], to: [helpers.deals.workspaceId] }),
        },
        investmentMandates: {
            workspaces: helpers.one.workspaces({ from: [helpers.investmentMandates.workspaceId], to: [helpers.workspaces.id] }),
            sectors: helpers.many.mandateSectors({ from: [helpers.investmentMandates.id], to: [helpers.mandateSectors.mandateId] }),
            criteria: helpers.many.mandateCriteria({ from: [helpers.investmentMandates.id], to: [helpers.mandateCriteria.mandateId] }),
        },
        mandateSectors: {
            investmentMandates: helpers.one.investmentMandates({ from: [helpers.mandateSectors.mandateId], to: [helpers.investmentMandates.id] }),
        },
        mandateCriteria: {
            investmentMandates: helpers.one.investmentMandates({ from: [helpers.mandateCriteria.mandateId], to: [helpers.investmentMandates.id] }),
        },
        companies: {
            workspaces: helpers.one.workspaces({ from: [helpers.companies.workspaceId], to: [helpers.workspaces.id] }),
            contacts: helpers.many.contacts({ from: [helpers.companies.id], to: [helpers.contacts.companyId] }),
            financialPeriods: helpers.many.companyFinancialPeriods({ from: [helpers.companies.id], to: [helpers.companyFinancialPeriods.companyId] }),
            deals: helpers.many.deals({ from: [helpers.companies.id], to: [helpers.deals.companyId] }),
        },
        contacts: {
            companies: helpers.one.companies({ from: [helpers.contacts.companyId], to: [helpers.companies.id] }),
        },
        companyFinancialPeriods: {
            companies: helpers.one.companies({ from: [helpers.companyFinancialPeriods.companyId], to: [helpers.companies.id] }),
        },
        deals: {
            workspaces: helpers.one.workspaces({ from: [helpers.deals.workspaceId], to: [helpers.workspaces.id] }),
            companies: helpers.one.companies({ from: [helpers.deals.companyId], to: [helpers.companies.id] }),
            economics: helpers.one.dealEconomics({ from: [helpers.deals.id], to: [helpers.dealEconomics.dealId] }),
        },
        dealEconomics: {
            deals: helpers.one.deals({ from: [helpers.dealEconomics.dealId], to: [helpers.deals.id] }),
        },
        onboardingDrafts: {
            users: helpers.one.users({ from: [helpers.onboardingDrafts.userId], to: [helpers.users.id] }),
        },
    }),
);
