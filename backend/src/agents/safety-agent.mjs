/** Preserves FDA/DailyMed safety facts as flags; it does not make clinical decisions. */
export function flagSafety({ warnings = [], contraindications = [] } = {}) {
  return {
    agent: 'safety',
    warnings,
    contraindications,
    compatibility: contraindications.length ? 'review-required' : 'no-flag-from-supplied-records',
    disclaimer: 'Safety flags require clinician and regulatory review.'
  };
}
