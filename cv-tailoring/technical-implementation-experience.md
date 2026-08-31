# Technical Implementation Experience — Source Notes

Hands-on technical/build experience — actual product and infrastructure work, not just process or strategy. Two examples, both current.

Order:

1. priroda.tech (founder, built from scratch)
2. Planhat (integrations specialist, current)

---

## 1. priroda.tech — Built From Scratch (Startup Founder, 2025–now)

**What it is:** digital operations system for florist/flower shops, initially targeting the Spanish market, built to address Spain's new Verifactu tax-compliance law requiring every business to digitally report receipts to the tax authority. ~6,000 flower shops in the addressable Spanish market; goal is 5% market share by end of 2026.

**Built solo, end to end:**
- **Product/backend:** Python backend + React frontend.
- **Database:** started on Airtable, currently in transition to Supabase (Postgres) as the system database.
- **Authentication:** built auth into the app for client/business-owner access.
- **Multi-tenancy:** architected the system to serve multiple independent shop-owner clients (tenants) from one platform.
- **Payment system integration:** iOS app includes integrated payments end-to-end.
- **Tax reporting / Verifactu connector:** built the integration/connector to the Spanish tax authority's (Agencia Tributaria) Verifactu system so every receipt is digitally reported as required by law — software is registered with the Spanish tax authority.
- **iOS app:** designed, built, and released a fully functional iOS app, now in production with 2 paying clients in Spain.
- **E-commerce / seamless integrations:** built connector capability so the platform can integrate with e-commerce and other external systems used by the shops.
- **Infrastructure/deployment:** Railway + Vercel deployment instances (currently provisioned per client manually).
- **Go-to-market tooling built alongside the product:** landing site with SEO/Spanish translation and a demo-request funnel, an outbound email pipeline warmed up via Instantly, and a home-built web scraper that parsed ~1,000 flower-shop leads from Google Maps.

**Scale markers to quantify further (confirm exact figures before publishing):**
- Number of servers / deployment instances currently running.
- Number of API endpoints exposed by the backend.

**Result so far:** fully functional product live in production, 2 paying clients, registered with the Spanish tax authority, ready-to-launch acquisition pipeline (leads, email, landing funnel) for wider Spain rollout.

---

## 2. Planhat — Integrations Specialist (2026–now)

**What it is:** Planhat is an Agentic Customer Platform (CRM/CSP) used by SaaS and enterprise companies to run customer success, revenue, and go-to-market operations. Clients run Planhat embedded inside large SaaS ecosystems (HubSpot, Salesforce, Snowflake, BigQuery, Zendesk, Intercom, Pendo, and more).

**Scope of ownership (per user, to fold into portfolio detail):**
- Oversees **100+ repositories** across a microservices architecture.
- Manages integrations on top of a **comprehensive GCP infrastructure** stack.
- Works across **multiple BigQuery instances** used to capture and centralize logging/data.
- Responsible for **3 databases** under the hood.
- Supports **~500 client accounts**, each with its own distinct logging and its own set of third-party integrations.
- Can connect essentially any B2B SaaS tool to any other — most enterprise SaaS tools expose usable connectors/APIs, so cross-system integration is routine work, not a blocker.

**Concrete tools built:**
- Proactive error-monitoring tool that catches integration/data errors before clients report them — saved dozens of support tickets.
- AI-powered Formulas Builder on top of Planhat's workflow engine, letting non-technical support staff configure automations directly instead of escalating to engineering — saves hundreds of engineering hours per month.

**Result:** owns integration reliability across a large, heterogeneous multi-tenant SaaS estate (100+ repos, 3 databases, GCP + BigQuery, 500 clients), while also building internal tooling that removes engineering as a bottleneck for common automation/config requests.

---

## Notes for CV tailoring

- This block is the "I actually build/ship the technical thing myself" proof point — use it when a vacancy calls for hands-on technical credibility (architecture, data, integrations), not just process/strategy leadership.
- The specific scale numbers for Planhat (100+ repos, 3 databases, 500 clients, GCP/BigQuery) and the priroda.tech server/endpoint counts should be double-checked against actual current figures before they go into a published CV — flagged here as user-provided, not yet verified against a source system.
