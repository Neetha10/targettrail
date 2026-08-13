# TargetTrail

Evidence-backed clinical trial intelligence for biological targets.

## Demo

Open `index.html` in a browser. Search for **JAK1**, **IL-17A**, or **PD-1** to explore a target's clinical maturity, linked drug candidates, live registry-trial records, and disease-association evidence.

## Live data

The browser app makes direct public requests to:

- Open Targets Platform GraphQL API: target resolution, tractability, target-disease associations, and drug/clinical-candidate records
- ClinicalTrials.gov API v2: live NCT records, phase, and recruitment status

If a request is unavailable, the original sample data is shown as a clearly labelled fallback.

## Scope

This hackathon prototype is a research-prioritization interface only—not clinical guidance or proof of efficacy. Clinical-trial phase and status do not establish a treatment's efficacy or safety.

## Next integrations

- ClinicalTrials.gov: trial phase, status, identifiers, and outcomes
- Open Targets / ChEMBL: target–drug–disease relationships
- Convoke: unmet-need signals
- Bright Data: monitored public pipeline and regulatory updates

## Project structure

```text
index.html / styles.css / app.js   Frontend experience and live public-data lookups
backend/                           AWS Lambda research-agent API and scoring function
data/contracts/                    Auditable opportunity-record format
infra/                             AWS SAM deployment template
docs/                              Architecture and data-source guidance
```
