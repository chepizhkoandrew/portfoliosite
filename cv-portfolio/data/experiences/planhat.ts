export const planhatExperience = {
  id: 'planhat',
  slug: 'planhat',
  title: 'Integrations Specialist',
  company: 'Planhat',
  startYear: 2026,
  endYear: null,
  duration: '2026 - now',
  color: '#0ea5e9',
  logo: '/experienceicons/planhat.png',
  overview: 'Managing integration issues between Planhat CRM and 10+ SaaS tools (HubSpot, Salesforce, Snowflake, BigQuery, Zendesk, Intercom, Pendo, and more) for enterprise clients',

  description: [
    'Planhat is an Agentic Customer Platform (CRM/CSP) used by leading SaaS and enterprise companies to run customer success, revenue, and go-to-market operations',
    'Clients run Planhat inside a wide SaaS ecosystem — HubSpot, Salesforce, Snowflake, BigQuery, Zendesk, Intercom, Pendo, and dozens of others — which adds real complexity to their data flows',
    'Own diagnosing and resolving integration issues across that ecosystem so client data keeps syncing correctly',
  ],

  achievements: [
    'Built a monitoring tool that proactively catches data errors in integration flows, predicting and fixing issues before clients raise them — saved dozens of support tickets',
    'Developed an AI-powered Formulas Builder on top of the existing formulas and workflow engine, letting non-technical support staff configure automations directly — removed the need to escalate to engineering, saving hundreds of engineering hours per month',
  ],

  companyUrl: 'https://www.planhat.com/',

  detailedContent: `
## Client Overview

Planhat positions itself as an Agentic Customer Platform — a CRM/CSP where AI agents and humans collaborate to run go-to-market and customer success work. It's used by leading SaaS and enterprise companies to manage the full customer lifecycle: onboarding, health scoring, renewals, and revenue operations.

## The Complexity

Planhat rarely runs alone. Clients plug it into a broader SaaS ecosystem — HubSpot, Salesforce, Snowflake, BigQuery, Zendesk, Intercom, Pendo, and more — to keep customer, product, and support data in sync across systems. That interconnection is powerful, but it also means every sync failure, schema change, or API limit on either side can break the data flow between tools.

## What I Do

I manage integration issues between Planhat and this wider SaaS ecosystem — diagnosing sync failures, tracing data errors back to their source, and fixing broken flows so client data stays accurate and up to date.

## Tools Built

- **Proactive error monitoring** — a tool that watches integration flows for data errors and catches them before they surface as client-reported issues, saving dozens of tickets.
- **AI Formulas Builder** — an AI layer on top of Planhat's existing formulas and workflow engine that lets support staff build automations without deep technical knowledge, removing the need to route this work to engineering and saving hundreds of engineering hours per month.
  `,

  skills: [
    'Integration Troubleshooting',
    'Workflow Automation',
    'Data Pipelines',
    'AI Tooling',
    'HubSpot',
    'Salesforce',
    'Snowflake',
    'BigQuery',
    'Zendesk',
    'Freshdesk',
    'Intercom',
    'Pendo',
    'OAuth 2.0',
    'MCP (Model Context Protocol)',
    'Root Cause Analysis',
  ],

  projects: [
    {
      name: 'Recovering Hundreds of Silently Dropped CRM Deal Records',
      overview: 'A B2B SaaS company running Planhat alongside HubSpot noticed a growing gap between deals recorded in Planhat and deals actually landing in HubSpot — hundreds of deals missing, and the gap widening daily. As the integrations partner, I traced the failures to HubSpot\'s batch update API, which rejects an entire batch of up to 100 deals the moment a single record inside it fails validation — and Planhat was advancing its sync checkpoint regardless, so every good deal sharing a batch with one bad one was silently discarded and never retried. I isolated the exact records poisoning each batch, quantified the blast radius, and handed the client a clear remediation path plus a batch-isolation recommendation so a single bad record can no longer take down hundreds of valid ones with it.',
      tags: ['HubSpot', 'REST APIs', 'Batch Processing', 'Data Integrity'],
    },
    {
      name: 'Fixing a Silent Field-Mapping Corruption in a Salesforce Sync',
      overview: 'An enterprise client relying on Planhat to push their internal record ID into a dedicated Salesforce field noticed the field was quietly showing the wrong value. I traced this to a platform-level defect: saving certain field mappings could silently rewrite a reference-type field back to a raw ID field, breaking the translation layer between the two systems with no error or warning to the client. I engineered a workaround — rebuilding the mapping through a formula field the editor can\'t silently reclassify — restored correct values across tens of thousands of company records in a single backfill, and filed the underlying defect so it can\'t quietly resurface for this or any other client.',
      tags: ['Salesforce', 'Field Mapping', 'Data Reconciliation', 'Platform Defect Triage'],
    },
    {
      name: 'Uncovering a Systemic Silent-Failure Pattern Across Multiple Accounts',
      overview: 'A cybersecurity SaaS client reported a custom Salesforce record that should have synced into Planhat but simply never appeared, with no error visible anywhere. Standard log sources showed nothing, so I went two layers deeper into raw platform logs and found the true failure point: a database-level uniqueness rule silently rejecting the insert. The structural root cause was a field mapping writing the same Salesforce account ID into two different Planhat fields, one of which fed a uniqueness constraint that only ever let the first record per account land — silently blocking every record submitted afterward. I confirmed it wasn\'t an isolated incident by finding two more accounts hitting the identical failure, fixed the mapping, and documented the failure class for immediate recognition if it resurfaces elsewhere.',
      tags: ['Salesforce', 'Data Modeling', 'Systemic Issue Detection', 'Root Cause Analysis'],
    },
    {
      name: 'Ending a 24-Day Silent Sync Outage and Closing an Alerting Gap',
      overview: 'A global electronics manufacturer flagged that their Salesforce-to-Planhat sync had simply stopped weeks earlier, with no one aware until stale data was noticed. Investigating the incident timeline, I found the integration\'s authenticated session had expired and the connector kept retrying the same dead session every ten minutes for over three weeks, failing identically each time without ever triggering an alert. I reconstructed the full outage window from raw logs to confirm no data was silently lost (rather than corrupted), got the client reconnected immediately, and pushed a recommendation upstream for proactive session-health alerting so a routine authentication expiry can never again turn into a multi-week blind spot.',
      tags: ['Salesforce', 'OAuth & Session Management', 'Monitoring & Alerting', 'Incident Analysis'],
    },
    {
      name: 'Reconciling Mismatched Customer Identifiers Across a Product Analytics Integration',
      overview: 'A compliance-software client relying on a product analytics tool for usage data noticed metrics were missing for a growing share of their customer base, even though the underlying data feed was confirmed to be running correctly. Digging into roughly 1,800 failed match attempts, I found the two systems were tracking the same companies under two structurally different identifier formats — one issuing standard random IDs, while a large cluster of Planhat\'s stored identifiers had clearly been bulk-generated by a single internal import using a different scheme entirely. I isolated the exact population affected, separated genuinely new companies from true identifier collisions, and handed the client a precise remediation list instead of a vague "some data is missing."',
      tags: ['Pendo', 'Data Reconciliation', 'Identity Resolution', 'Product Analytics'],
    },
    {
      name: 'Tracing Silently Rejected Revenue Records Through a Multi-Layer Data Pipeline',
      overview: 'A cybersecurity enterprise piping contract and billing data from Snowflake into Planhat found specific revenue line items vanishing from the sync — not failing, but disappearing without landing in any error bucket. I traced the pipeline layer by layer, first ruling out a section-level outage, then pulling per-record rejection detail from a deeper logging layer most teams never think to check. The investigation surfaced two distinct, overlapping root causes hiding behind the same symptom — a data-formatting inconsistency in the source system, and a genuinely missing required field on a separate population of records — and I kept digging past the first fix once verification showed a meaningful set of records were still failing for an entirely different reason, so the client got a complete resolution rather than a partial one.',
      tags: ['Snowflake', 'ETL Pipelines', 'Cloud Logging', 'Revenue Data Integrity'],
    },
    {
      name: 'Debugging an OAuth Spec-Compliance Bug Blocking AI Tool Integrations',
      overview: 'A cloud infrastructure client trying to connect Planhat to their AI coding assistant\'s tool-calling layer (MCP) hit a hard authentication failure the moment they tried to auto-discover the connection, while a second, manually-configured AI client worked fine. I traced both paths through Planhat\'s OAuth discovery chain, confirmed the advertised metadata was fully spec-correct, and isolated the real bug: the authorization endpoint was treating the OAuth `scope` parameter as mandatory, when the governing specification defines it as optional — so any client that auto-discovered the connection rather than being hand-configured got silently rejected. I separated this from a second, unrelated client-side configuration issue in the same report, gave the client an immediate path forward, and filed the spec-compliance defect so future AI-tooling integrations don\'t hit the same wall.',
      tags: ['OAuth 2.0', 'MCP (Model Context Protocol)', 'AI Tooling Integrations', 'API Spec Compliance'],
    },
    {
      name: 'Fixing a Concurrency Bug in a High-Volume Support Ticketing Sync',
      overview: 'A cloud storage client\'s support-desk integration would intermittently and unpredictably lose its authenticated connection, always during the busiest sync windows, then silently recover after a manual reconnect — only to fail again days later. Rather than treating each recurrence as a one-off, I traced the pattern to a genuine concurrency bug: when a live webhook and a bulk data refresh hit the token-refresh logic at nearly the same moment, both read the same authentication token before either could save its replacement, and the provider\'s own token-rotation security model then permanently invalidated the "losing" request\'s credentials. I reproduced the exact failure conditions, confirmed the fix scope extended to any tenant running concurrent sync activity, and delivered a race-condition-proof pattern the platform team could apply broadly instead of a one-off patch.',
      tags: ['Zendesk', 'OAuth', 'Concurrency Debugging', 'Root Cause Analysis'],
    },
    {
      name: 'Resolving a Support-Desk Automation Gap Hiding in Plain Sight',
      overview: 'A unified-communications software client couldn\'t understand why some support tickets synced their "Closed" status into Planhat correctly while others silently never updated, despite using what looked like the same automation rule. Rather than assuming a Planhat-side delivery problem, I proved directly from inbound webhook logs that no webhook had ever been sent for the affected tickets — the moment the data was manually pulled, it synced perfectly, ruling out any receiving-side fault. The real cause was a one-word configuration detail in the client\'s own help-desk automation: it was scoped to fire only for actions taken by an agent or the requester, while automatic ticket closures run under the system\'s own internal actor and were silently excluded. I handed the client an exact, evidence-backed fix instead of a guess.',
      tags: ['Freshdesk', 'Webhooks', 'Support Ops Automation', 'Log Forensics'],
    },
    {
      name: 'Disproving the Obvious Explanation to Find What Was Actually Happening',
      overview: 'A cybersecurity asset-management client flagged recurring gaps in their Snowflake-to-Planhat metrics feed and had already formed a theory: missed or failed nightly data builds on their side. Rather than accepting that theory at face value, I requested a full export of their pipeline\'s build history and cross-referenced every "gap day" against actual build execution timestamps — and the theory didn\'t hold: every underlying table had built successfully, multiple times, on every single day the client believed data was missing. Digging into how the sync actually tracks its position in the data, I reframed the investigation entirely: the "missing" days weren\'t lost data at all, they were days the underlying source data genuinely hadn\'t changed, and the pipeline was behaving exactly as designed — the kind of finding that saves a client weeks of chasing a phantom infrastructure problem.',
      tags: ['Snowflake', 'Data Pipelines', 'Hypothesis Testing', 'Root Cause Analysis'],
    },
  ],
}
