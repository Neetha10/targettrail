# TargetTrail architecture

```text
Drug input
  -> identity agent (canonical drug ID)
  -> mechanism agent (targets and analogs)
  -> trial agent (ClinicalTrials.gov evidence)
  -> evidence agent (Open Targets and PubMed)
  -> safety agent (FDA label evidence)
  -> ranking/report agent (auditable opportunity record)
```

## Live sources today

- Open Targets GraphQL: target records, associations, and linked drug candidates
- ClinicalTrials.gov API v2: NCT records, phase, and recruitment status

## Backend-only sources

Bright Data must run behind the Lambda API. Its token is a secret and must never be sent to the browser or committed to Git. The collector returns only publicly available source metadata, original URLs, and short evidence excerpts.

## Score

`0.30 target overlap + 0.25 analog maturity + 0.25 target-disease evidence + 0.10 novelty + 0.10 safety compatibility`

Scores prioritize research hypotheses. They do not predict efficacy or provide treatment advice.
