/** Packages direct target and analog evidence returned by Open Targets/ChEMBL. */
export function analyzeMechanism({ target, directAnalogs = [], pathwayNeighbors = [] }) {
  if (!target) throw new Error('target is required');
  return {
    agent: 'mechanism', target,
    directAnalogs,
    pathwayNeighbors: pathwayNeighbors.map(item => ({ ...item, confidence: 'lower - pathway neighbor' })),
    rationale: 'Direct target overlap is prioritized above pathway-neighbor overlap.'
  };
}
