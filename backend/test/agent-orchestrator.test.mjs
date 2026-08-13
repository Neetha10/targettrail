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
    convoke: {
      query: 'target: TNF',
      retrievedAt: '2026-08-13T00:00:00Z',
      totalProgramCount: 2,
      programs: [{ drug_name: 'adalimumab', indication_name: 'Rheumatoid arthritis', development_stage: 'Regulatory Approval', program_status: 'Active', organizations: ['AbbVie'], targets: ['TNF'], modalities: ['Antibody'], trials: [{ nct_id: 'NCT00000000', phase: 'Phase 3', trial_name: 'Example trial' }] }]
    },
    scoreComponents: { targetOverlap: 90, analogMaturity: 80, targetDiseaseEvidence: 70, novelty: 60, safetyCompatibility: 90 }
  });
  assert.equal(result.identity.agent, 'identity');
  assert.equal(result.ranking.agent, 'ranking');
  assert.equal(result.convoke.agent, 'convoke');
  assert.equal(result.report.marketContext.totalProgramCount, 2);
  assert.equal(result.report.compositeScore, 80);
  assert.equal(result.report.drug, 'Humira');
});
