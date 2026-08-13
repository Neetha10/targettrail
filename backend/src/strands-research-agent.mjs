import { Agent, BedrockModel, tool } from '@strands-agents/sdk';
import { runResearchAgents } from './agent-orchestrator.mjs';

const MAX_SUMMARY_CHARS = 2400;

function asText(value) {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(asText).filter(Boolean).join('\n');
  if (value && typeof value === 'object') {
    if (typeof value.text === 'string') return value.text;
    if (Array.isArray(value.content)) return asText(value.content);
  }
  return '';
}

function sourceUrls(research) {
  const urls = [
    ...(research.report?.evidence || []).map(item => item.url),
    ...(research.convoke?.catalysts || []).flatMap(item => item.sourceUrls || [])
  ].filter(url => typeof url === 'string' && /^https:\/\//.test(url));
  return [...new Set(urls)].slice(0, 20);
}

function evidenceLedger(research) {
  return {
    drug: research.report?.drug,
    candidateDisease: research.report?.candidateDisease,
    mechanism: research.mechanism,
    trials: research.trials,
    safety: research.safety,
    marketContext: research.convoke,
    evidence: research.report?.evidence || [],
    sourceUrls: sourceUrls(research)
  };
}

function createLedgerTool(ledger) {
  return tool({
    name: 'retrieve_novatarget_evidence_ledger',
    description: 'Return the immutable, citation-ready NovaTarget evidence ledger. Use this before writing a research summary.',
    inputSchema: {
      type: 'object',
      properties: { section: { type: 'string', description: 'Optional ledger section to inspect.' } },
      additionalProperties: false
    },
    callback: () => JSON.stringify(ledger)
  });
}

function createModel() {
  const modelId = process.env.STRANDS_BEDROCK_MODEL_ID;
  if (!modelId) return undefined;
  return new BedrockModel({
    modelId,
    region: process.env.AWS_REGION || 'us-east-1',
    temperature: 0.1
  });
}

/**
 * Adds a model-generated narrative to the deterministic, auditable report.
 * The composite score remains deterministic and never becomes an LLM output.
 */
export async function runStrandsResearchAgent(input) {
  const research = runResearchAgents(input);
  const ledger = evidenceLedger(research);
  const model = createModel();
  const agent = new Agent({
    ...(model ? { model } : {}),
    printer: false,
    tools: [createLedgerTool(ledger)],
    systemPrompt: [
      'You are NovaTarget’s research-synthesis agent.',
      'You must call retrieve_novatarget_evidence_ledger before responding.',
      'Use only returned evidence. Do not infer efficacy, safety, clinical benefit, or treatment recommendations.',
      'Clearly distinguish program activity from clinical evidence.',
      'Return a concise research summary with the source URLs supplied by the ledger.'
    ].join(' ')
  });
  const result = await agent.invoke(
    `Summarize the evidence for the ${ledger.drug || 'input drug'} and ${ledger.candidateDisease || 'candidate disease'} research hypothesis. ` +
    'State evidence gaps and next validation questions. Do not include a numeric score.'
  );
  const summary = asText(result.lastMessage).trim().slice(0, MAX_SUMMARY_CHARS);
  return {
    ...research,
    strands: {
      agent: 'strands',
      sdk: '@strands-agents/sdk',
      provider: 'Amazon Bedrock',
      modelId: process.env.STRANDS_BEDROCK_MODEL_ID || 'SDK default',
      summary: summary || 'The Strands agent returned no text summary.',
      sourceUrls: ledger.sourceUrls,
      disclaimer: 'Strands synthesizes supplied research evidence. It does not calculate the opportunity score or establish efficacy, safety, or treatment suitability.'
    }
  };
}
