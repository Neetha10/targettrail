import { scoreOpportunity } from './scoring.mjs';
import { collectBrightDataEvidence } from './bright-data-evidence.mjs';

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    'content-type': 'application/json',
    'access-control-allow-origin': process.env.ALLOWED_ORIGIN || '*'
  },
  body: JSON.stringify(body)
});

/**
 * AWS Lambda entry point.
 * Intended routes:
 * - POST /score: calculates TargetTrail's transparent composite score
 * - POST /evidence: calls Bright Data server-side and returns original public URLs + snippets
 */
export async function handler(event) {
  const path = event.rawPath || event.path || '/';
  if (event.requestContext?.http?.method === 'OPTIONS') return json(204, {});
  let body = {};
  try { body = event.body ? JSON.parse(event.body) : {}; } catch { return json(400, { error: 'Invalid JSON body' }); }

  if (path.endsWith('/score')) {
    try { return json(200, scoreOpportunity(body)); }
    catch (error) { return json(400, { error: error.message }); }
  }

  if (path.endsWith('/evidence')) {
    try {
      const evidence = await collectBrightDataEvidence({
        sources: body.sources,
        token: process.env.BRIGHT_DATA_API_TOKEN,
        zone: process.env.BRIGHT_DATA_ZONE
      });
      return json(200, { evidence, disclaimer: 'Collected excerpts are source context. They are not independent clinical conclusions.' });
    } catch (error) {
      const status = /token and zone|required|maximum|HTTPS|Local URLs/.test(error.message) ? 400 : 502;
      return json(status, { error: error.message });
    }
  }

  return json(404, { error: 'Route not found' });
}
