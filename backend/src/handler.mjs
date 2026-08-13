import { scoreOpportunity } from './scoring.mjs';

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
 * - POST /evidence: later, calls Bright Data server-side and returns original public URLs + snippets
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
    if (!process.env.BRIGHT_DATA_API_TOKEN) {
      return json(503, { error: 'Bright Data is not configured. Set BRIGHT_DATA_API_TOKEN in AWS Secrets Manager or Lambda environment variables.' });
    }
    // Keep Bright Data access server-side. Return only source URL, title, date, and a short quoted snippet.
    // Add the Bright Data Web Scraper API request here after the hackathon workspace supplies its dataset/zone.
    return json(501, { error: 'Bright Data collector is configured as the next integration step.', query: body });
  }

  return json(404, { error: 'Route not found' });
}
