import type { ModelTier } from "@repo/ai";
import type { AgentTask } from "../lib/claim";
import * as brandAgent from "./brand-agent";
import * as companyProfileAgent from "./company-profile-agent";

export type AgentLane = {
    run(task: AgentTask, options?: { modelTier?: ModelTier }): Promise<string>;
};

const lanes: Record<string, AgentLane> = {
    brand: brandAgent,
    company_profile: companyProfileAgent,
};

export function getLane(task: AgentTask): AgentLane {
    return lanes[task.kind] ?? companyProfileAgent;
}
