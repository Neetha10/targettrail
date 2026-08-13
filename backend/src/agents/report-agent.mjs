/** Creates one portable, citation-first record for a drug-disease research hypothesis. */
export function generateOpportunityReport({ drug, candidateDisease, mechanism, trials = [], evidence = [], safety, ranking }) {
  if (!drug || !candidateDisease) throw new Error('drug and candidateDisease are required');
  return {
    drug,
    candidateDisease,
    mechanismRationale: mechanism?.rationale || 'Mechanism rationale pending',
    trials,
    evidence,
    safety,
    compositeScore: ranking?.score ?? null,
    confidenceTier: ranking?.tier ?? 'Not scored',
    disclaimer: 'Research-prioritization hypothesis only; not a treatment recommendation.'
  };
}
