const targets = {
  JAK1: {
    name: 'JAK1', fullName: 'Janus kinase 1', type: 'KINASE TARGET', score: 91, label: 'Highly validated',
    stats: [['14', 'target-linked drugs', 'Across approved & investigational'], ['48', 'completed trials', 'In the evidence set'], ['9', 'Phase 3 trials', 'Across 5 indications'], ['4', 'approved indications', 'Strong clinical precedent']],
    phases: [['Phase 1', 9], ['Phase 2', 18], ['Phase 3', 9], ['Approved', 4]],
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

const clean = value => value.toUpperCase().replace(/[^A-Z0-9]/g, '');
const state = { current: 'JAK1' };
const input = document.querySelector('#target-input');
const suggestions = document.querySelector('#suggestions');

function renderTarget(key) {
  const t = targets[key]; if (!t) return;
  state.current = key; input.value = t.name;
  document.querySelector('#target-type').textContent = t.type;
  document.querySelector('#target-name').innerHTML = `${t.name} <span>${t.fullName}</span>`;
  document.querySelector('#maturity-score').textContent = t.score;
  document.querySelector('.score-ring').style.background = `conic-gradient(var(--teal) 0 ${t.score}%, #d4ddcf 0)`;
  document.querySelector('#maturity-label').textContent = t.label;
  document.querySelector('#summary-grid').innerHTML = t.stats.map(([value,label,delta]) => `<article class="stat"><strong>${value}</strong><span>${label}</span><div class="delta">${delta}</div></article>`).join('');
  const max = Math.max(...t.phases.map(([,v])=>v));
  document.querySelector('#phase-chart').innerHTML = t.phases.map(([label,value]) => `<div class="bar-item"><span class="bar-value">${value}</span><div class="bar" style="height:${(value/max)*125}px"></div><span class="bar-label">${label}</span></div>`).join('');
  document.querySelector('#chart-note').textContent = t.note;
  document.querySelector('#signal-list').innerHTML = t.signals.map(([title,text]) => `<div class="signal"><strong>${title}</strong><span>${text}</span></div>`).join('');
  document.querySelector('#evidence-grid').innerHTML = t.evidence.map(([source,phase,title,text,citation]) => `<article class="evidence-card"><div class="evidence-top"><span class="evidence-tag">${source}</span><span class="phase-tag">${phase}</span></div><h4>${title}</h4><p>${text}</p><a class="citation" href="https://clinicaltrials.gov/search?term=${encodeURIComponent(citation)}" target="_blank" rel="noreferrer">${citation}</a></article>`).join('');
  document.querySelector('#opportunity-text').textContent = t.opportunity;
  document.querySelector('#opportunity-score').textContent = t.opportunityScore;
  document.querySelector('#opportunity-label').textContent = t.opportunityLabel;
  suggestions.innerHTML = '';
}
function showSuggestions() {
  const q = clean(input.value);
  const matches = Object.entries(targets).filter(([key,t]) => key.includes(q) || clean(t.name).includes(q) || clean(t.fullName).includes(q));
  suggestions.innerHTML = matches.length && q ? matches.map(([key,t]) => `<button type="button" data-key="${key}">${t.name}<small>${t.fullName}</small></button>`).join('') : '';
}
document.querySelector('#search-form').addEventListener('submit', e => { e.preventDefault(); const key = Object.keys(targets).find(k => clean(k) === clean(input.value) || clean(targets[k].name) === clean(input.value)); if (key) { renderTarget(key); document.querySelector('#results').scrollIntoView({behavior:'smooth', block:'start'}); } else { input.setCustomValidity('Try JAK1, IL-17A, or PD-1 for this prototype.'); input.reportValidity(); } });
input.addEventListener('input', () => { input.setCustomValidity(''); showSuggestions(); });
suggestions.addEventListener('click', e => { const key = e.target.closest('button')?.dataset.key; if (key) renderTarget(key); });
document.querySelector('.quick-targets').addEventListener('click', e => { const target = e.target.dataset.target; if (target) renderTarget(target); });
document.addEventListener('click', e => { if (!e.target.closest('.input-wrap')) suggestions.innerHTML = ''; });
renderTarget('JAK1');
