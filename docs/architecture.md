# NovaTarget architecture

```text
Drug input
  -> identity agent (canonical drug ID)
  -> mechanism agent (targets and analogs)
  -> trial agent (ClinicalTrials.gov evidence)
  -> evidence agent (Open Targets and PubMed)
  -> Convoke context agent (program pipeline and catalysts)
  -> safety agent (FDA label evidence)
  -> ranking/report agent (auditable opportunity record)
  -> optional Strands synthesis agent (Bedrock-backed narrative from the immutable ledger)
```

Each responsibility has its own backend module in `backend/src/agents/`; `agent-orchestrator.mjs` assembles their outputs into a citation-first opportunity report.

## Live sources today

- Open Targets GraphQL: target records, associations, and linked drug candidates
- ClinicalTrials.gov API v2: NCT records, phase, and recruitment status

## Backend-only sources

Bright Data runs behind the Lambda Evidence Agent. Its token is a secret and must never be sent to the browser or committed to Git. `POST /evidence` accepts up to five HTTPS public URLs and sends each to Bright Data Web Unlocker. It returns only original URL, title, collection time, purpose, and a short source excerpt.

Use Bright Data for public company pipeline pages, investor updates, regulatory announcements, and trial press releases. Use direct official APIs for Open Targets, ClinicalTrials.gov, PubMed, and FDA labels whenever available.

## Convoke MCP context

Convoke is queried by an authenticated MCP client, not by the browser or Lambda. The client supplies normalized Program Tracker and Catalyst Calendar results to `POST /research` as `convoke`. The Convoke agent adds this provenance-preserving material to `report.marketContext`. It is excluded from score calculation because program counts and catalyst events are market-context evidence, not direct evidence of efficacy, safety, or patient need.

## Score

`0.30 target overlap + 0.25 analog maturity + 0.25 target-disease evidence + 0.10 novelty + 0.10 safety compatibility`

When callers request `orchestrator: "strands"`, `strands-research-agent.mjs` runs a Strands SDK agent with a read-only ledger tool. It may synthesize the source-backed narrative but cannot modify the deterministic score components.

Scores prioritize research hypotheses. They do not predict efficacy or provide treatment advice.
