import { rankOpportunity } from './agents/ranking-agent.mjs';
import { collectEvidence } from './agents/evidence-agent.mjs';
import { runResearchAgents } from './agent-orchestrator.mjs';

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
 * - POST /score: invokes the Ranking Agent's transparent composite score
 * - POST /evidence: calls Bright Data server-side and returns original public URLs + snippets
 * - POST /research: runs the deterministic multi-agent report workflow; accepts
 *   normalized Convoke context collected by an authenticated MCP client
 */
export async function handler(event) {
  const path = event.rawPath || event.path || '/';
  if (event.requestContext?.http?.method === 'OPTIONS') return json(204, {});
  let body = {};
  try { body = event.body ? JSON.parse(event.body) : {}; } catch { return json(400, { error: 'Invalid JSON body' }); }

  if (path.endsWith('/score')) {
    try { return json(200, rankOpportunity(body)); }
    catch (error) { return json(400, { error: error.message }); }
  }

  if (path.endsWith('/evidence')) {
    try {
      const evidence = await collectEvidence({
        sources: body.sources,
        brightDataToken: process.env.BRIGHT_DATA_API_TOKEN,
        brightDataZone: process.env.BRIGHT_DATA_ZONE
      });
      return json(200, { evidence, disclaimer: 'Collected excerpts are source context. They are not independent clinical conclusions.' });
    } catch (error) {
      const status = /token and zone|required|maximum|HTTPS|Local URLs/.test(error.message) ? 400 : 502;
      return json(status, { error: error.message });
    }
  }

  if (path.endsWith('/research')) {
    try { return json(200, runResearchAgents(body)); }
    catch (error) { return json(400, { error: error.message }); }
  }

  return json(404, { error: 'Route not found' });
}
