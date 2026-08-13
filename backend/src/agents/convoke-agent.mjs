/**
 * Normalizes context retrieved through Convoke MCP. The MCP client owns its
 * credentials; this module deliberately accepts only already-retrieved data.
 */
function strings(values, limit = 8) {
  return [...new Set((Array.isArray(values) ? values : []).filter(value => typeof value === 'string' && value.trim()).map(value => value.trim()))].slice(0, limit);
}

function program(record = {}) {
  return {
    drug: typeof record.drug_name === 'string' ? record.drug_name : 'Unspecified program',
    indication: typeof record.indication_name === 'string' ? record.indication_name : 'Unspecified indication',
    stage: typeof record.development_stage === 'string' ? record.development_stage : 'Not reported',
    status: typeof record.program_status === 'string' ? record.program_status : 'Not reported',
    organizations: strings(record.organizations),
    targets: strings(record.targets),
    modality: strings(record.modalities, 3),
    trials: (Array.isArray(record.trials) ? record.trials : []).slice(0, 5).map(trial => ({
      nctId: typeof trial.nct_id === 'string' ? trial.nct_id : null,
      phase: typeof trial.phase === 'string' ? trial.phase : 'Not reported',
      name: typeof trial.trial_name === 'string' ? trial.trial_name : 'Trial name not reported',
      primaryCompletionDate: typeof trial.primary_completion_date === 'string' ? trial.primary_completion_date : null
    }))
  };
}

/** Builds citation-ready market context without assigning a clinical score. */
export function summarizeConvokeContext(context = {}) {
  if (!context || typeof context !== 'object' || Array.isArray(context)) throw new Error('convoke context must be an object');
  const programs = (Array.isArray(context.programs) ? context.programs : []).slice(0, 50).map(program);
  const catalysts = (Array.isArray(context.catalysts) ? context.catalysts : []).slice(0, 50).map(event => ({
    name: typeof event.event_name === 'string' ? event.event_name : 'Unnamed catalyst',
    reportedDate: typeof event.reported_date === 'string' ? event.reported_date : 'Not reported',
    drugs: strings(event.drugs),
    indications: strings(event.indications),
    organizations: strings(event.organizations),
    sourceUrls: strings(event.source_urls, 5)
  }));
  const totalProgramCount = Number.isInteger(context.totalProgramCount) && context.totalProgramCount >= programs.length
    ? context.totalProgramCount
    : programs.length;

  return {
    agent: 'convoke',
    source: 'Convoke MCP',
    query: typeof context.query === 'string' ? context.query.slice(0, 500) : 'Program Tracker and Catalyst Calendar query',
    retrievedAt: typeof context.retrievedAt === 'string' ? context.retrievedAt : null,
    totalProgramCount,
    programs,
    catalysts,
    disclaimer: 'Convoke program and catalyst data describe development activity, not clinical efficacy, safety, or unmet need by themselves.'
  };
}
