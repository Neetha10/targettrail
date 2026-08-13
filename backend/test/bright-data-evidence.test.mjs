import test from 'node:test';
import assert from 'node:assert/strict';
import { collectBrightDataEvidence } from '../src/bright-data-evidence.mjs';

test('collects a cited excerpt through the Bright Data request API', async () => {
  let request;
  const fakeFetch = async (url, options) => {
    request = { url, options };
    return new Response(JSON.stringify({ body: '<title>FDA announcement</title><p>Public source text for review.</p>' }), { status: 200 });
  };
  const [record] = await collectBrightDataEvidence({
    token: 'test-token', zone: 'web_unlocker', fetchImpl: fakeFetch,
    sources: [{ url: 'https://www.fda.gov/example', purpose: 'Regulatory context' }]
  });
  assert.equal(request.url, 'https://api.brightdata.com/request');
  assert.equal(JSON.parse(request.options.body).zone, 'web_unlocker');
  assert.equal(record.url, 'https://www.fda.gov/example');
  assert.equal(record.title, 'FDA announcement');
});

test('rejects unsafe evidence URLs', async () => {
  await assert.rejects(
    collectBrightDataEvidence({ token: 'x', zone: 'y', sources: [{ url: 'http://localhost:3000' }] }),
    /HTTPS|Local URLs/
  );
});
