/** Normalizes ClinicalTrials.gov records into citation-ready trial evidence. */
export function summarizeTrials(studies = []) {
  return studies.map(study => {
    const protocol = study.protocolSection || {};
    const nctId = protocol.identificationModule?.nctId;
    return {
      nctId,
      title: protocol.identificationModule?.briefTitle || 'Clinical trial record',
      phase: (protocol.designModule?.phases || []).join(', ') || 'Not reported',
      status: protocol.statusModule?.overallStatus || 'Not reported',
      url: nctId ? `https://clinicaltrials.gov/study/${nctId}` : 'https://clinicaltrials.gov/',
      source: 'ClinicalTrials.gov'
    };
  });
}
