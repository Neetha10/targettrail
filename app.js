const targets = {
  JAK1: {
    name: 'JAK1', fullName: 'Janus kinase 1', type: 'KINASE TARGET', score: 91, label: 'Highly validated',
    stats: [['14', 'target-linked drugs', 'Across approved & investigational'], ['48', 'completed trials', 'In the evidence set'], ['9', 'Phase 3 trials', 'Across 5 indications'], ['4', 'approved indications', 'Strong clinical precedent']],
    phases: [['Phase 1', 9], ['Phase 2', 18], ['Phase 3', 9], ['Approved', 4]],
    diseases: [['rheumatoid arthritis', 71, 'MONDO_0008383'], ['atopic eczema', 60, 'MONDO_0004980'], ['myelofibrosis', 59, 'MONDO_0044903'], ['alopecia areata', 55, 'MONDO_0005340'], ['ulcerative colitis', 51, 'MONDO_0005101']],
    note: 'Trials shown are representative target-linked records; production data should refresh from public registries.',
    signals: [['Validated in immune-mediated disease', 'Repeated late-stage activity across inflammatory and autoimmune indications.'], ['Breadth across therapeutic areas', 'Clinical evidence spans dermatology, rheumatology, and gastroenterology.'], ['Safety pattern to assess', 'Class-related infection and thrombosis risk warrants indication-specific review.']],
    evidence: [
      ['CLINICALTRIALS.GOV', 'PHASE 3', 'Atopic dermatitis — Upadacitinib', 'Completed late-stage study evaluating a JAK1 inhibitor in moderate-to-severe atopic dermatitis.', 'NCT03568318'],
      ['CLINICALTRIALS.GOV', 'PHASE 3', 'Rheumatoid arthritis — Filgotinib', 'Target-linked Phase 3 development supports mature clinical understanding in inflammatory disease.', 'NCT02886728'],
      ['FDA / LABEL', 'APPROVED', 'JAK pathway safety context', 'Approved-product labeling establishes a public safety and dosing evidence base for this target class.', 'FDA drug labels']
    ],
    opportunity: 'The target has strong precedent in immune-mediated disease. Prioritize indications with a shared inflammatory mechanism but limited late-stage pipeline activity.', opportunityScore: 74, opportunityLabel: 'Promising to investigate'
  },
  IL17A: {
    name: 'IL-17A', fullName: 'Interleukin 17A', type: 'CYTOKINE TARGET', score: 88, label: 'Highly validated',
    stats: [['8', 'target-linked drugs', 'Across approved & investigational'], ['36', 'completed trials', 'In the evidence set'], ['8', 'Phase 3 trials', 'Across 4 indications'], ['3', 'approved indications', 'Strong dermatology precedent']],
    phases: [['Phase 1', 6], ['Phase 2', 12], ['Phase 3', 8], ['Approved', 3]],
    diseases: [['psoriasis vulgaris', 82, 'EFO_0000676'], ['psoriatic arthritis', 75, 'MONDO_0005014'], ['ankylosing spondylitis', 70, 'MONDO_0005301'], ['hidradenitis suppurativa', 61, 'MONDO_0006559'], ['inflammatory bowel disease', 54, 'EFO_0003767']],
    note: 'Signals show a well-established target, especially in dermatology and rheumatology.',
    signals: [['High confidence in psoriasis', 'Multiple IL-17 inhibitors have reached approval in plaque psoriasis.'], ['Clear pathway relevance', 'IL-17A is a central driver of type 17 inflammation in several immune diseases.'], ['Mixed disease translation', 'Success in one inflammatory disease does not ensure efficacy in another; trial context matters.']],
    evidence: [
      ['CLINICALTRIALS.GOV', 'PHASE 3', 'Plaque psoriasis — Secukinumab', 'Late-stage clinical development of IL-17A inhibition in moderate-to-severe plaque psoriasis.', 'NCT01365455'],
      ['CLINICALTRIALS.GOV', 'PHASE 3', 'Psoriatic arthritis — Ixekizumab', 'Target-specific clinical evaluation in an inflammatory arthritis setting.', 'NCT01695239'],
      ['FDA / LABEL', 'APPROVED', 'IL-17A inhibitor labels', 'Public labels provide approved indications and key warnings for the target class.', 'FDA drug labels']
    ],
    opportunity: 'Strong dermatology precedent suggests looking for type 17-driven conditions where disease burden is high but target-specific development remains sparse.', opportunityScore: 69, opportunityLabel: 'Promising to investigate'
  },
  PDCD1: {
    name: 'PD-1', fullName: 'Programmed cell death protein 1', type: 'IMMUNE CHECKPOINT TARGET', score: 96, label: 'Extensively validated',
    stats: [['19', 'target-linked drugs', 'Across approved & investigational'], ['82', 'completed trials', 'In the evidence set'], ['24', 'Phase 3 trials', 'Across oncology indications'], ['14', 'approved indications', 'Broad oncology precedent']],
    phases: [['Phase 1', 12], ['Phase 2', 28], ['Phase 3', 24], ['Approved', 14]],
    diseases: [['cutaneous melanoma', 86, 'MONDO_0005105'], ['non-small cell lung carcinoma', 83, 'MONDO_0005233'], ['renal cell carcinoma', 80, 'MONDO_0005086'], ['Hodgkin lymphoma', 78, 'MONDO_0004952'], ['hepatocellular carcinoma', 73, 'MONDO_0007256']],
    note: 'PD-1 is one of the most clinically mature immune-oncology targets.',
    signals: [['Broad oncology validation', 'Checkpoint inhibition has produced approvals in multiple tumor types.'], ['Combination-led development', 'Much of the next-wave evidence is generated in rational combinations and earlier disease settings.'], ['Immune-related safety profile', 'Risk assessment must account for immune-mediated adverse events.']],
    evidence: [
      ['CLINICALTRIALS.GOV', 'PHASE 3', 'Melanoma — Pembrolizumab', 'Pivotal program evaluating PD-1 blockade in advanced melanoma.', 'NCT01866319'],
      ['CLINICALTRIALS.GOV', 'PHASE 3', 'Non-small cell lung cancer — Nivolumab', 'Late-stage evidence for PD-1 inhibition in a major solid tumor indication.', 'NCT01642004'],
      ['FDA / LABEL', 'APPROVED', 'Checkpoint inhibitor safety context', 'Approved labels describe indication-specific use and immune-related adverse-event considerations.', 'FDA drug labels']
    ],
    opportunity: 'This target is clinically mature. The most useful question is not whether it works, but which biomarker-defined populations or combinations have enough rationale to justify the next trial.', opportunityScore: 61, opportunityLabel: 'Selective opportunity'
  }
};

const OPEN_TARGETS_URL = 'https://api.platform.opentargets.org/api/v4/graphql';
const CLINICAL_TRIALS_URL = 'https://clinicaltrials.gov/api/v2/studies';
const TARGET_ALIASES = { 'PD1': 'PDCD1', 'PD-1': 'PDCD1', 'IL17A': 'IL17A', 'IL-17A': 'IL17A' };
const DRUG_TO_TARGET = {
  HUMIRA: 'TNF', ADALIMUMAB: 'TNF', INFLIXIMAB: 'TNF', ETANERCEPT: 'TNF',
  BARICITINIB: 'JAK1', UPADACITINIB: 'JAK1', ABROCITINIB: 'JAK1', FILGOTINIB: 'JAK1',
  SECUKINUMAB: 'IL17A', IXEKIZUMAB: 'IL17A', BIMEKIZUMAB: 'IL17A',
  PEMBROLIZUMAB: 'PDCD1', NIVOLUMAB: 'PDCD1', CEMIPLIMAB: 'PDCD1'
};
const clean = value => value.toUpperCase().replace(/[^A-Z0-9]/g, '');
const state = { current: 'JAK1' };
const input = document.querySelector('#target-input');
const suggestions = document.querySelector('#suggestions');

function renderTarget(targetOrKey) {
  const t = typeof targetOrKey === 'string' ? targets[targetOrKey] : targetOrKey;
  if (!t) return;
  state.current = t.name; input.value = t.name;
  document.querySelector('#target-type').textContent = t.type;
  document.querySelector('#target-name').innerHTML = `${t.name} <span>${t.fullName}</span>`;
  document.querySelector('#maturity-score').textContent = t.score;
  document.querySelector('.score-ring').style.background = `conic-gradient(var(--teal) 0 ${t.score}%, #d4ddcf 0)`;
  document.querySelector('#maturity-label').textContent = t.label;
  document.querySelector('#summary-grid').innerHTML = t.stats.map(([value,label,delta], index) => {
    const content = `<strong>${value}</strong><span>${label}</span><div class="delta">${delta}</div>`;
    return `<article class="stat">${index === 0 ? `<button class="stat-button" type="button" id="open-drug-drawer" aria-haspopup="dialog">${content}</button>` : content}</article>`;
  }).join('');
  document.querySelector('#drawer-list').innerHTML = (t.linkedDrugs || []).map(drug => `<a class="linked-drug" href="https://platform.opentargets.org/drug/${drug.id}" target="_blank" rel="noreferrer"><div class="linked-drug-top"><strong>${drug.name}</strong><span class="linked-drug-stage">${drug.stage}</span></div><p>${drug.indications?.length ? drug.indications.join(' · ') : 'No linked indication listed'}</p></a>`).join('') || '<p class="drawer-note">No linked drug details were returned for this target.</p>';
  document.querySelector('#drug-drawer-title').textContent = `${t.name} linked drugs`;
  document.querySelector('#drug-drawer-subtitle').textContent = `${t.linkedDrugs?.length || 0} records displayed. Each name opens its Open Targets source page.`;
  document.querySelector('#open-drug-drawer')?.addEventListener('click', openDrugDrawer);
  const diseaseRows = t.diseases || [];
  document.querySelector('#disease-grid').innerHTML = diseaseRows.slice(0, 5).map(([name, score, diseaseId], index) => {
    const label = score >= 70 ? 'Strong evidence association' : score >= 50 ? 'Moderate evidence association' : 'Emerging evidence association';
    const citationUrl = t.targetId && diseaseId ? `https://platform.opentargets.org/evidence/${t.targetId}/${diseaseId}` : `https://platform.opentargets.org/search?q=${encodeURIComponent(name)}`;
    return `<a class="disease-card" href="${citationUrl}" target="_blank" rel="noreferrer" aria-label="View Open Targets evidence for ${name}"><span class="disease-rank">#${index + 1} ASSOCIATION</span><strong class="disease-score">${score}<small>/100</small></strong><div class="disease-name">${name}</div><div class="association-label">${label}</div><div class="association-bar"><span style="width:${score}%"></span></div><div class="association-citation">View source ↗</div></a>`;
  }).join('') || '<article class="disease-card"><div class="disease-name">No disease associations were returned.</div></article>';
  const max = Math.max(1, ...t.phases.map(([,v])=>v));
  document.querySelector('#phase-chart').innerHTML = t.phases.map(([label,value]) => `<div class="bar-item"><span class="bar-value">${value}</span><div class="bar" style="height:${(value/max)*125}px"></div><span class="bar-label">${label}</span></div>`).join('');
  document.querySelector('#chart-note').textContent = t.note;
  document.querySelector('#signal-list').innerHTML = t.signals.map(([title,text]) => `<div class="signal"><strong>${title}</strong><span>${text}</span></div>`).join('');
  document.querySelector('#evidence-grid').innerHTML = t.evidence.map(([source,phase,title,text,citation,url]) => `<article class="evidence-card"><div class="evidence-top"><span class="evidence-tag">${source}</span><span class="phase-tag">${phase}</span></div><h4>${title}</h4><p>${text}</p><a class="citation" href="${url || `https://clinicaltrials.gov/search?term=${encodeURIComponent(citation)}`}" target="_blank" rel="noreferrer">${citation}</a></article>`).join('');
  document.querySelector('#opportunity-text').textContent = t.opportunity;
  document.querySelector('#opportunity-score').textContent = t.opportunityScore;
  document.querySelector('#opportunity-label').textContent = t.opportunityLabel;
  document.querySelector('#trial-source').textContent = t.live ? 'Open Targets + ClinicalTrials.gov • live' : 'Demo fallback data';
  document.querySelector('#live-status').textContent = t.live ? 'Live public-data workspace' : 'Demo fallback workspace';
  suggestions.innerHTML = '';
}

async function openTargetsQuery(query, variables) {
  const response = await fetch(OPEN_TARGETS_URL, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ query, variables })
  });
  const payload = await response.json();
  if (!response.ok || payload.errors?.length) throw new Error(payload.errors?.[0]?.message || 'Open Targets request failed');
  return payload.data;
}

async function findTarget(searchTerm) {
  const query = `query FindTarget($queryString: String!) {
    search(queryString: $queryString, entityNames: ["target"]) { hits { id entity name description } }
  }`;
  const data = await openTargetsQuery(query, { queryString: TARGET_ALIASES[searchTerm.toUpperCase()] || searchTerm });
  return data.search.hits.find(hit => hit.entity === 'target') || null;
}

async function getTargetRecord(ensemblId) {
  const query = `query NovaTarget($ensemblId: String!) {
    target(ensemblId: $ensemblId) {
      id approvedSymbol approvedName
      tractability { modality label value }
      associatedDiseases(page: { index: 0, size: 6 }) { count rows { disease { id name } score } }
      drugAndClinicalCandidates {
        count
        rows { maxClinicalStage drug { id name } diseases { disease { id name } } }
      }
    }
  }`;
  const data = await openTargetsQuery(query, { ensemblId });
  if (!data.target) throw new Error('No Open Targets record found');
  return data.target;
}

async function getClinicalTrials(symbol) {
  const url = new URL(CLINICAL_TRIALS_URL);
  url.searchParams.set('query.term', symbol);
  url.searchParams.set('pageSize', '100');
  url.searchParams.set('format', 'json');
  const response = await fetch(url);
  if (!response.ok) throw new Error('ClinicalTrials.gov request failed');
  const payload = await response.json();
  return payload.studies || [];
}

function stageLabel(stage = '') {
  return ({ APPROVAL: 'Approved', PHASE_4: 'Phase 4', PHASE_3: 'Phase 3', PHASE_2: 'Phase 2', PHASE_1: 'Phase 1', PRECLINICAL: 'Preclinical' })[stage] || 'Clinical';
}

function trialPhase(study) {
  const phases = study.protocolSection?.designModule?.phases || [];
  if (phases.includes('PHASE3')) return 'Phase 3';
  if (phases.includes('PHASE2')) return 'Phase 2';
  if (phases.includes('PHASE1') || phases.includes('EARLY_PHASE1')) return 'Phase 1';
  return 'Other';
}

function clinicalTrialEvidence(study) {
  const protocol = study.protocolSection || {};
  const id = protocol.identificationModule?.nctId || 'ClinicalTrials.gov record';
  const title = protocol.identificationModule?.briefTitle || 'Clinical trial record';
  const status = protocol.statusModule?.overallStatus || 'Status unavailable';
  return ['CLINICALTRIALS.GOV', trialPhase(study).toUpperCase(), title, `Live registry record: ${status.replaceAll('_', ' ').toLowerCase()}.`, id, `https://clinicaltrials.gov/study/${id}`];
}

function liveTargetToView(target, trials) {
  const candidates = target.drugAndClinicalCandidates?.rows || [];
  const candidateCount = target.drugAndClinicalCandidates?.count || candidates.length;
  const approvals = candidates.filter(row => row.maxClinicalStage === 'APPROVAL').length;
  const phase3 = candidates.filter(row => row.maxClinicalStage === 'PHASE_3').length;
  const trialCounts = { 'Phase 1': 0, 'Phase 2': 0, 'Phase 3': 0, Other: 0 };
  trials.forEach(study => { trialCounts[trialPhase(study)] += 1; });
  const associations = (target.associatedDiseases?.rows || []).filter(row => row.disease?.name).slice(0, 5);
  const topAssociation = associations[0];
  const targetScore = Math.min(99, Math.round(45 + Math.min(candidateCount, 30) * 1.25 + approvals * 2 + phase3 * 1.5));
  const label = targetScore >= 90 ? 'Highly validated' : targetScore >= 75 ? 'Clinically established' : 'Emerging evidence';
  const candidateSummary = candidates.slice(0, 3).map(row => `${row.drug?.name || 'Unnamed drug'} (${stageLabel(row.maxClinicalStage)})`).join(', ');
  const evidence = [
    ['OPEN TARGETS', 'LIVE GRAPHQL', `${candidateCount} drug and clinical candidates`, candidateSummary ? `Representative target-linked candidates: ${candidateSummary}.` : 'No target-linked drug rows were returned.', `Open Targets: ${target.approvedSymbol}`, `https://platform.opentargets.org/target/${target.id}`],
    ...trials.slice(0, 2).map(clinicalTrialEvidence)
  ];
  while (evidence.length < 3) evidence.push(['CLINICALTRIALS.GOV', 'LIVE SEARCH', 'No additional registry result in this search', 'Try a target synonym or inspect the Open Targets linked-drug list.', 'ClinicalTrials.gov search', `https://clinicaltrials.gov/search?term=${encodeURIComponent(target.approvedSymbol)}`]);
  return {
    name: target.approvedSymbol, fullName: target.approvedName || target.approvedSymbol, targetId: target.id, type: 'LIVE OPEN TARGETS RECORD', score: targetScore, label, live: true,
    stats: [[String(candidateCount), 'target-linked drugs', 'Open Targets clinical candidates'], [String(trials.length), 'registry trials returned', `ClinicalTrials.gov: ${target.approvedSymbol}`], [String(phase3), 'Phase 3 candidates', 'Open Targets maximum stage'], [String(approvals), 'approved candidates', 'Open Targets maximum stage']],
    linkedDrugs: candidates.map(row => ({
      id: row.drug?.id,
      name: row.drug?.name || 'Unnamed drug',
      stage: stageLabel(row.maxClinicalStage),
      indications: [...new Set((row.diseases || []).map(item => item.disease?.name).filter(Boolean))].slice(0, 3)
    })),
    phases: [['Phase 1', trialCounts['Phase 1']], ['Phase 2', trialCounts['Phase 2']], ['Phase 3', trialCounts['Phase 3']], ['Other', trialCounts.Other]],
    diseases: associations.map(row => [row.disease.name, Math.round(row.score * 100), row.disease.id]),
    note: `Live ClinicalTrials.gov search returned ${trials.length} records for “${target.approvedSymbol}”. Trial counts are registry search results, not efficacy outcomes.`,
    signals: [
      ['Target–disease evidence', topAssociation ? `${topAssociation.disease?.name || 'Top disease'} has the highest returned Open Targets association score (${Math.round(topAssociation.score * 100)}/100).` : 'No target-disease associations returned.'],
      ['Clinical development breadth', `${candidateCount} target-linked drug or clinical-candidate records are available from Open Targets.`],
      ['Interpret with care', 'Association and development-stage signals prioritize research; they do not establish treatment efficacy or safety.']
    ], evidence,
    opportunity: topAssociation ? `Start with ${topAssociation.disease?.name || 'the highest-ranked association'}, then compare unmet need and active pipeline activity before proposing a new indication.` : 'Add disease-burden and pipeline data before prioritizing a potential new indication.',
    opportunityScore: topAssociation ? Math.round(topAssociation.score * 100) : 0, opportunityLabel: 'Evidence association signal'
  };
}

async function loadLiveTarget(searchTerm) {
  document.querySelector('#live-status').textContent = 'Querying live public data…';
  document.querySelector('#trial-source').textContent = 'Loading live sources…';
  const hit = await findTarget(searchTerm);
  if (!hit) throw new Error(`No target found for “${searchTerm}”`);
  const target = await getTargetRecord(hit.id);
  const trials = await getClinicalTrials(target.approvedSymbol);
  renderTarget(liveTargetToView(target, trials));
}

function openDrugDrawer() {
  const drawer = document.querySelector('#drug-drawer');
  drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false');
  document.querySelector('#drawer-backdrop').hidden = false;
  document.querySelector('#drawer-close').focus();
}
function closeDrugDrawer() {
  const drawer = document.querySelector('#drug-drawer');
  drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true');
  document.querySelector('#drawer-backdrop').hidden = true;
}
function showSuggestions() {
  const q = clean(input.value);
  const matches = Object.entries(targets).filter(([key,t]) => key.includes(q) || clean(t.name).includes(q) || clean(t.fullName).includes(q));
  suggestions.innerHTML = matches.length && q ? matches.map(([key,t]) => `<button type="button" data-key="${key}">${t.name}<small>${t.fullName}</small></button>`).join('') : '';
}
document.querySelector('#search-form').addEventListener('submit', async e => { e.preventDefault(); const requested = input.value.trim(); if (!requested) return; try { await loadLiveTarget(requested); document.querySelector('#results').scrollIntoView({behavior:'smooth', block:'start'}); } catch (error) { const key = Object.keys(targets).find(k => clean(k) === clean(requested) || clean(targets[k].name) === clean(requested)); if (key) { renderTarget(targets[key]); document.querySelector('#live-status').textContent = 'Live request unavailable — demo fallback shown'; } else { input.setCustomValidity(error.message); input.reportValidity(); } } });
input.addEventListener('input', () => { input.setCustomValidity(''); showSuggestions(); });
suggestions.addEventListener('click', e => { const key = e.target.closest('button')?.dataset.key; if (key) { input.value = targets[key].name; document.querySelector('#search-form').requestSubmit(); } });
document.querySelector('.quick-targets').addEventListener('click', e => { const target = e.target.dataset.target; if (target) { input.value = target; document.querySelector('#search-form').requestSubmit(); } });
document.addEventListener('click', e => { if (!e.target.closest('.input-wrap')) suggestions.innerHTML = ''; });
document.querySelectorAll('.workspace-tab').forEach(tab => tab.addEventListener('click', () => {
  const destination = tab.dataset.tab;
  document.querySelectorAll('.workspace-tab').forEach(item => { const active = item === tab; item.classList.toggle('active', active); item.setAttribute('aria-selected', active); });
  document.querySelectorAll('[role="tabpanel"]').forEach(panel => panel.classList.toggle('hidden', panel.id !== destination));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}));
document.querySelectorAll('.open-target-tab').forEach(button => button.addEventListener('click', () => document.querySelector('[data-tab="target-tab"]').click()));
document.querySelector('#drawer-close').addEventListener('click', closeDrugDrawer);
document.querySelector('#drawer-backdrop').addEventListener('click', closeDrugDrawer);
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeDrugDrawer(); });
document.querySelector('#drug-search-form').addEventListener('submit', event => {
  event.preventDefault();
  const drugInput = document.querySelector('#drug-input');
  const helper = document.querySelector('#drug-helper');
  const target = DRUG_TO_TARGET[clean(drugInput.value)];
  if (!target) {
    helper.textContent = 'This demo supports Humira, Baricitinib, Secukinumab, Pembrolizumab, and related examples.';
    drugInput.focus();
    return;
  }
  helper.textContent = `Resolved ${drugInput.value.trim()} → ${target}. Opening live target evidence…`;
  document.querySelector('[data-tab="target-tab"]').click();
  input.value = target;
  document.querySelector('#search-form').requestSubmit();
});
renderTarget(targets.JAK1);
loadLiveTarget('JAK1').catch(() => { document.querySelector('#live-status').textContent = 'Live request unavailable — demo fallback shown'; });
