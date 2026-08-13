/** Resolves a user-entered drug name into a normalized research record. */
export function resolveDrugIdentity({ drugName, canonicalId, source = 'User input' }) {
  if (!drugName || typeof drugName !== 'string') throw new Error('drugName is required');
  return {
    agent: 'identity',
    drugName: drugName.trim(),
    canonicalId: canonicalId || null,
    source,
    status: canonicalId ? 'resolved' : 'needs-canonical-id'
  };
}
