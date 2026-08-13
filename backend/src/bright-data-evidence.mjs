const MAX_SOURCES = 5;
const MAX_SNIPPET_LENGTH = 500;

function validateSource(source) {
  if (!source?.url || typeof source.url !== 'string') throw new Error('Each evidence source needs a URL');
  const url = new URL(source.url);
  if (url.protocol !== 'https:') throw new Error('Evidence URLs must use HTTPS');
  if (url.hostname === 'localhost' || /^127\.|^0\.0\.0\.0$/.test(url.hostname)) throw new Error('Local URLs are not allowed');
  return { url: url.toString(), purpose: typeof source.purpose === 'string' ? source.purpose.slice(0, 140) : 'Public evidence check' };
}

function compactText(value = '') {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[`*_>#\[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTitle(value = '') {
  const htmlTitle = value.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  const markdownTitle = value.match(/^#\s+(.+)$/m)?.[1];
  return compactText(htmlTitle || markdownTitle || '').slice(0, 180) || 'Public source';
}

/**
 * Fetches only user-supplied public sources through Bright Data Web Unlocker.
 * This returns provenance metadata and a short excerpt; it does not infer medical claims.
 */
export async function collectBrightDataEvidence({ sources, token, zone, fetchImpl = fetch }) {
  if (!token || !zone) throw new Error('Bright Data token and zone are required');
  if (!Array.isArray(sources) || sources.length === 0) throw new Error('Provide at least one public evidence source');
  if (sources.length > MAX_SOURCES) throw new Error(`A maximum of ${MAX_SOURCES} sources can be collected per request`);

  const safeSources = sources.map(validateSource);
  const records = await Promise.all(safeSources.map(async source => {
    const response = await fetchImpl('https://api.brightdata.com/request', {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({ zone, url: source.url, format: 'raw', data_format: 'markdown' })
    });
    if (!response.ok) throw new Error(`Bright Data returned ${response.status} for ${new URL(source.url).hostname}`);
    const payload = await response.json();
    const content = typeof payload.body === 'string' ? payload.body : JSON.stringify(payload.body || '');
    return {
      source: 'Bright Data Web Unlocker',
      url: source.url,
      purpose: source.purpose,
      title: extractTitle(content),
      excerpt: compactText(content).slice(0, MAX_SNIPPET_LENGTH),
      collectedAt: new Date().toISOString()
    };
  }));
  return records;
}
