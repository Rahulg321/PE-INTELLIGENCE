import { defineRelations } from "drizzle-orm";
import { users, sessions, accounts, verifications, rateLimits } from "./auth";
import { firms, investmentMandates, mandateSectors, mandateCriteria } from "./firms";
import { deals } from "./deals";
import { onboardingDrafts } from "./onboarding-drafts";

export const relations = defineRelations(
    { users, sessions, accounts, verifications, rateLimits, firms, investmentMandates, mandateSectors, mandateCriteria, deals, onboardingDrafts },
    (helpers) => ({
        users: {
            sessions: helpers.many.sessions({ from: [helpers.users.id], to: [helpers.sessions.userId] }),
            accounts: helpers.many.accounts({ from: [helpers.users.id], to: [helpers.accounts.userId] }),
            firms: helpers.many.firms({ from: [helpers.users.id], to: [helpers.firms.ownerUserId] }),
            deals: helpers.many.deals({ from: [helpers.users.id], to: [helpers.deals.userId] }),
            onboardingDrafts: helpers.one.onboardingDrafts({ from: [helpers.users.id], to: [helpers.onboardingDrafts.userId] }),
        },
        sessions: {
            users: helpers.one.users({ from: [helpers.sessions.userId], to: [helpers.users.id] }),
        },
        accounts: {
            users: helpers.one.users({ from: [helpers.accounts.userId], to: [helpers.users.id] }),
        },
        firms: {
            users: helpers.one.users({ from: [helpers.firms.ownerUserId], to: [helpers.users.id] }),
            investmentMandates: helpers.many.investmentMandates({ from: [helpers.firms.id], to: [helpers.investmentMandates.firmId] }),
        },
        investmentMandates: {
            firms: helpers.one.firms({ from: [helpers.investmentMandates.firmId], to: [helpers.firms.id] }),
            sectors: helpers.many.mandateSectors({ from: [helpers.investmentMandates.id], to: [helpers.mandateSectors.mandateId] }),
            criteria: helpers.many.mandateCriteria({ from: [helpers.investmentMandates.id], to: [helpers.mandateCriteria.mandateId] }),
        },
        mandateSectors: {
            investmentMandates: helpers.one.investmentMandates({ from: [helpers.mandateSectors.mandateId], to: [helpers.investmentMandates.id] }),
        },
        mandateCriteria: {
            investmentMandates: helpers.one.investmentMandates({ from: [helpers.mandateCriteria.mandateId], to: [helpers.investmentMandates.id] }),
        },
        deals: {
            users: helpers.one.users({ from: [helpers.deals.userId], to: [helpers.users.id] }),
        },
        onboardingDrafts: {
            users: helpers.one.users({ from: [helpers.onboardingDrafts.userId], to: [helpers.users.id] }),
        },
    }),
);
