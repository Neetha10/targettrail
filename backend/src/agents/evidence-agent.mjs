import { collectBrightDataEvidence } from '../bright-data-evidence.mjs';

/** Collects citation-preserving public web context using Bright Data server-side. */
export async function collectEvidence({ sources, brightDataToken, brightDataZone, fetchImpl }) {
  return collectBrightDataEvidence({
    sources,
    token: brightDataToken,
    zone: brightDataZone,
    ...(fetchImpl ? { fetchImpl } : {})
  });
}
