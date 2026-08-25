import type { TaskRef } from "../lib/task";
import type { LaneDeps } from "../lib/agent-loop";
import * as brandAgent from "./brand-agent";
import * as companyProfileAgent from "./company-profile-agent";

export type AgentLane = {
    run(task: TaskRef, deps?: LaneDeps): Promise<string>;
};

const lanes: Record<string, AgentLane> = {
    brand: brandAgent,
    company_profile: companyProfileAgent,
};

export function getLane(task: TaskRef): AgentLane {
    return lanes[task.kind] ?? companyProfileAgent;
}
