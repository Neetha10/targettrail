import { scoreOpportunity } from '../scoring.mjs';

/** Computes NovaTarget's explicit, auditable research-prioritization score. */
export function rankOpportunity(components) {
  return { agent: 'ranking', ...scoreOpportunity(components) };
}
