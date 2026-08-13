/**
 * Explainable research-prioritization score. Inputs must be normalized to 0-100.
 * This ranks hypotheses; it never estimates clinical efficacy.
 */
export function scoreOpportunity({
  targetOverlap = 0,
  analogMaturity = 0,
  targetDiseaseEvidence = 0,
  novelty = 0,
  safetyCompatibility = 0
}) {
  const inputs = { targetOverlap, analogMaturity, targetDiseaseEvidence, novelty, safetyCompatibility };
  for (const [name, value] of Object.entries(inputs)) {
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      throw new Error(`${name} must be a number between 0 and 100`);
    }
  }

  const score = Math.round(
    targetOverlap * 0.30 +
    analogMaturity * 0.25 +
    targetDiseaseEvidence * 0.25 +
    novelty * 0.10 +
    safetyCompatibility * 0.10
  );
  const tier = score >= 75 ? 'High-priority hypothesis' : score >= 55 ? 'Promising - needs validation' : 'Exploratory signal';
  return { score, tier, components: inputs };
}
