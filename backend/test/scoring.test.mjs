import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreOpportunity } from '../src/scoring.mjs';

test('weights the opportunity score transparently', () => {
  const result = scoreOpportunity({
    targetOverlap: 90,
    analogMaturity: 80,
    targetDiseaseEvidence: 70,
    novelty: 60,
    safetyCompatibility: 90
  });
  assert.equal(result.score, 80);
  assert.equal(result.tier, 'High-priority hypothesis');
});

test('rejects invalid score components', () => {
  assert.throws(() => scoreOpportunity({ targetOverlap: 101 }), /between 0 and 100/);
});
