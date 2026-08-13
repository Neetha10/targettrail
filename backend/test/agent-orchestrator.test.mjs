import test from 'node:test';
import assert from 'node:assert/strict';
import { runResearchAgents } from '../src/agent-orchestrator.mjs';

test('coordinates separate agent outputs into an auditable report', () => {
  const result = runResearchAgents({
    drugName: 'Humira',
    canonicalId: 'CHEMBL1201583',
    target: 'TNF',
    candidateDisease: 'Example disease',
    mechanism: { target: 'TNF', directAnalogs: ['adalimumab'] },
    scoreComponents: { targetOverlap: 90, analogMaturity: 80, targetDiseaseEvidence: 70, novelty: 60, safetyCompatibility: 90 }
  });
  assert.equal(result.identity.agent, 'identity');
  assert.equal(result.ranking.agent, 'ranking');
  assert.equal(result.report.compositeScore, 80);
  assert.equal(result.report.drug, 'Humira');
});
