import { resolveDrugIdentity } from './agents/identity-agent.mjs';
import { analyzeMechanism } from './agents/mechanism-agent.mjs';
import { summarizeTrials } from './agents/trial-agent.mjs';
import { flagSafety } from './agents/safety-agent.mjs';
import { summarizeConvokeContext } from './agents/convoke-agent.mjs';
import { rankOpportunity } from './agents/ranking-agent.mjs';
import { generateOpportunityReport } from './agents/report-agent.mjs';

/** Coordinates deterministic agent outputs; external lookup calls remain explicit at API boundaries. */
export function runResearchAgents(input) {
  const identity = resolveDrugIdentity(input);
  const mechanism = analyzeMechanism(input.mechanism || { target: input.target });
  const trials = summarizeTrials(input.studies || []);
  const safety = flagSafety(input.safety);
  const convoke = summarizeConvokeContext(input.convoke);
  const ranking = rankOpportunity(input.scoreComponents || {});
  const report = generateOpportunityReport({
    drug: identity.drugName,
    candidateDisease: input.candidateDisease,
    mechanism,
    trials,
    evidence: input.evidence || [],
    safety,
    marketContext: convoke,
    ranking
  });
  return { identity, mechanism, trials, safety, convoke, ranking, report };
}
