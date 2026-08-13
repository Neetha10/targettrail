# NovaTarget

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
- Convoke MCP: live program-pipeline and catalyst context
- Bright Data: monitored public pipeline and regulatory updates

### Bright Data Evidence Agent

The Lambda endpoint `POST /evidence` uses Bright Data Web Unlocker server-side. Send public source URLs only; the response preserves each original URL and a short extract for citation. Deploy with `BrightDataApiToken` and `BrightDataZone` parameters. Never expose either value in `app.js`, `.env`, or GitHub.

## Project structure

```text
index.html / styles.css / app.js   Frontend experience and live public-data lookups
backend/                           AWS Lambda research-agent API and scoring function
data/contracts/                    Auditable opportunity-record format
infra/                             AWS SAM deployment template
docs/                              Architecture and data-source guidance
```

### Agent modules

`backend/src/agents/` keeps the responsibilities separate: `identity-agent`, `mechanism-agent`, `trial-agent`, `evidence-agent`, `safety-agent`, `ranking-agent`, and `report-agent`. The Lambda handler invokes `agent-orchestrator.mjs`, which coordinates these modules.

### Convoke market-context lane

An authenticated Convoke MCP client queries the **Program Tracker** and **Catalyst Calendar**, then sends only normalized results in the `convoke` field to `POST /research`. `convoke-agent.mjs` preserves drug, indication, stage, organization, target, trial, and catalyst context in the final report as `marketContext`.

Convoke credentials remain in the MCP client and are never placed in the browser, Lambda environment, or repository. Market context is intentionally not a component of the composite opportunity score: program activity and catalyst timing can guide research review, but do not independently establish efficacy, safety, or patient unmet need.

### Strands research-synthesis agent

NovaTarget uses the [Strands Agents TypeScript SDK](https://strandsagents.com/docs/user-guide/quickstart/typescript/) for optional evidence synthesis in the Lambda backend. Send `POST /research` with `"orchestrator": "strands"` to run a Strands agent backed by Amazon Bedrock. The agent must retrieve NovaTarget's immutable evidence ledger before summarizing it; it returns a concise narrative and the supplied source URLs.

The score remains deterministic. Strands never calculates, changes, or explains a clinical-efficacy score. Configure `STRANDS_BEDROCK_MODEL_ID` (or allow the SDK default), enable the model in Bedrock, and deploy the SAM template so the Lambda can invoke the model. Run `npm install` inside `backend/` before `sam build`.
