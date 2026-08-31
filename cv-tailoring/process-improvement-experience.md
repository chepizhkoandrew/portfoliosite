# Process Improvement & Automation — Source Notes

Generic process-improvement and automation experience — not finance-specific. Focus: how processes were diagnosed, what criteria were used to redesign them, what the measured effect was, and how it tied back to the company's goals. Pulled from existing CV/portfolio data and packed to the same scale/format as the finance block.

Order (relevance priority):

1. Boosta — SDLC redesign
2. Tribute Technologies — commissions system build
3. Takeoff Technologies — new client (retailer) onboarding redesign

---

## 1. Boosta — SDLC Process Redesign (Lead Product Owner, 2023–2024)

**Context:** Boosta ran 3 distinct product brands (PapersOwl, EduBirdie, MySuperGeek) — EdTech tutoring/ghost-writing platforms targeting Tier-1-country students — on one shared ~50-person engineering team.

**Problem diagnosed:**
- Team was organized across overlapping structures (functional roles, product-based groups, departmental hierarchy) that weren't aligned, so responsibilities constantly intersected and coordination ate time.
- No single source of truth for priorities across the 3 brands.
- Backlog was bloated and uncleared, causing >100 tasks running in parallel with none finishing.
- Release cycles were slow (new products/major features took ~4 months).

**What was done (criteria/approach for redesign):**
- Designed a prioritization system so the team could focus on one thing at a time, with clear scope boundaries per team.
- Formed and stood up 3 scrum teams (engineers + 1 Product Owner each), each with an explicitly agreed scope — so anyone in the org knew which team owned which type of request.
- Closed or restructured 1,000+ Jira backlog tickets into a clean epic structure.
- Established structured test-plan templates so traffic wasn't wasted testing weak/controversial hypotheses.
- Created a unified roadmap across the 3 brands as the single source of truth for priorities.

**Measured results:**
- Cycle time for new products/major features cut from **4 months to 6 weeks** (~3x faster).
- 1,000+ backlog tickets closed/reorganized.
- New release flow shipped for papersowl.com with improved ECR (conversion) metrics on a mature product.
- Reference program scaled from test sites to the entire portfolio, generating incremental revenue.
- New product (step2a.com) launched on the new, structured process from day one.

**Tie to company mission:** the SDLC redesign directly served Boosta's growth model — a shared team supporting many product brands — by removing coordination overhead so the team's fixed capacity could ship more products/features per quarter without adding headcount.

---

## 2. Tribute Technologies — Commissions Module (Freelance, ~4 months)

**Context:** Tribute Technologies runs software for a network of funeral homes and partner florists (flower/gift fulfillment tied to funeral services). Freelance engagement, ~4 months.

**Problem diagnosed:**
- Existing system lacked transparent, traceable commission logic across a multi-party network (funeral homes, florist partners, platform).
- Stakeholders couldn't trace a commission back to its source order — no order-level transparency.

**What was done:**
- Analyzed requirements through direct user interviews with stakeholders in the commission chain.
- Designed and refactored the commission calculation logic to handle multi-party splits (proxy parties and differing commission schemas depending on the partner relationship).
- Built the system so every commission could be traced back to its originating order, giving stakeholders transparency into how each party's cut was calculated.
- Technical layer: PostgreSQL/SQL-based system refactor.

**Result:** delivered a working, transparent multi-party commission system that replaced an opaque/untraceable process — directly supporting the business's core revenue-sharing model between the platform and its florist/funeral-home partners.

*(Note: this same engagement also appears in the finance/payments block, framed around the cost/revenue-breakdown design — here the framing is the process-improvement angle: diagnosing an untraceable process and redesigning it for transparency.)*

---

## 3. Takeoff Technologies — New Retailer Onboarding Redesign (Product Manager, 2019–2023)

**Context:** Takeoff Technologies (US) — a software-and-hardware e-grocery fulfillment platform (micro-fulfillment centers, B2B SaaS for grocery retailers). Managed 2 scrum teams daily; worked directly with grocery retailer network clients.

**Problem diagnosed:**
- New retailers took ~3 months to become operational on the platform — a major bottleneck to growth, since every new customer required heavy manual setup.
- ~500 product/configuration settings were scattered, requiring developer involvement for routine setup tasks.
- Login/access process was manual, creating security and provisioning overhead.
- No systematic way for frontline warehouse workers to detect and diagnose operational issues — problems surfaced late.

**Criteria for redesign:**
- Reduce dependency on engineering for routine configuration.
- Reduce time-to-value for new retailer customers.
- Improve security and reduce manual account-provisioning work.
- Give frontline operators visibility to self-resolve simple issues.

**What was done:**
- Centralized and restructured ~500 scattered product settings into one unified configuration system, so customer-facing teams could configure operational flows themselves without engineering.
- Implemented standardized onboarding templates and self-service integration tooling.
- Implemented SSO authentication, automating access provisioning/de-provisioning and improving security.
- Built warehouse monitoring/alerting tooling so field workers could identify and resolve issues directly, or hand off precise diagnostics to support — cutting time to restore normal operations.

**Measured results:**
- Onboarding time reduced from **~3 months to 3–4 weeks** (~3x), with later iterations reaching **weeks-to-days (3–5x)**.
- 500 settings centralized into a self-service configuration system.
- Faster, more secure access management via SSO.
- Faster operational issue detection/resolution via monitoring tooling.

**Tie to company mission:** Takeoff's growth depended on signing and activating new grocery retailer customers quickly; cutting onboarding time directly shortened the sales-to-revenue cycle and reduced the support/engineering cost of each new customer.

---

## Notes for CV tailoring

- This block demonstrates the general "diagnose → redesign with clear criteria → measure the result → tie back to business goal" pattern across three different domains (internal engineering org, multi-party financial/commission logic, external B2B customer onboarding).
- Use only the pieces of this block relevant to the target vacancy — don't include all three if the role only calls for one flavor of process improvement.
