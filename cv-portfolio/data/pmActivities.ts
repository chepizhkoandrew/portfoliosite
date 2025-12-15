export interface PMActivity {
  id: string
  title: string
  description: string[]
  proficiency: number
}

export const pmActivities: PMActivity[] = [
  {
    id: 'market-discovery',
    title: 'Market Discovery',
    description: [
      'Create accounts on competitor platforms to test onboarding flows, feature sets, pricing logic, and limitations',
      'Run indirect "buyer-style" inquiries to competitors to obtain real pricing, documentation, and product specs',
      'Crawl or scrape public sources such as pricing pages, documentation portals, release notes, and user reviews',
      'Gather regulatory documents, standards, white papers, and industry reports to understand constraints and trends',
      'Explore API docs, integration guides, and sandbox environments to assess real technical capabilities',
      'Analyse product positioning and messaging patterns across the market to identify gaps and opportunities',
    ],
    proficiency: 95,
  },
  {
    id: 'customer-development',
    title: 'Customer Development',
    description: [
      'Run structured interviews to capture exact workflows, blockers, and how people solve problems today',
      'Observe real user processes through screen recordings or shadowing sessions to document actual behaviour',
      'Validate the severity and frequency of pains by asking for concrete examples rather than opinions',
      'Test willingness to pay or adopt by presenting realistic scenarios and measuring reactions',
      'Group findings into clear segments, use cases, and priority problems based on evidence',
      'Review patterns across different user profiles to isolate the most valuable problems to solve',
    ],
    proficiency: 92,
  },
  {
    id: 'product-scoping',
    title: 'Product Scoping',
    description: [
      'Define essential use cases the product must support to deliver the core value',
      'Break the concept into minimal functional units to form the first workable release',
      'Draft simple user flows, workflow diagrams, and data interactions to expose hidden complexity',
      'Identify which capabilities must be delivered now, and which can be postponed without harming value',
      'Walk engineers through edge cases and operational constraints to confirm feasibility',
      'Consolidate scope into a clear, bounded product definition that avoids unnecessary expansion',
    ],
    proficiency: 94,
  },
  {
    id: 'business-case',
    title: 'Business Case Calculation',
    description: [
      'Build straightforward financial models estimating revenue, cost savings, efficiency gains, or automation impact',
      'Calculate delivery cost, infrastructure cost, and projected maintenance load over time',
      'Run multiple scenarios (pessimistic, baseline, optimistic) to see how assumptions affect ROI',
      'Estimate adoption potential using available data, competitive patterns, or early user signals',
      'Summarise whether the initiative is worth doing based on clear financial and strategic reasoning',
      'Adjust the business case once new information appears during discovery or early delivery',
    ],
    proficiency: 88,
  },
  {
    id: 'roadmapping',
    title: 'Roadmapping & Prioritisation',
    description: [
      'Convert scoped capabilities into a clear sequence of releases with dependencies mapped',
      'Score each item using simple, transparent criteria such as impact, effort, urgency, or operational risk',
      'Mark regulatory or integration-related constraints that influence timing and ordering',
      'Review trade-offs with engineering and stakeholders and adjust sequencing based on reality',
      'Keep the roadmap alive, updating it as new information appears or priorities shift',
      'Prevent overload by managing capacity and avoiding parallel work that creates unnecessary friction',
    ],
    proficiency: 96,
  },
  {
    id: 'requirements-design',
    title: 'Requirements & Technical Design',
    description: [
      'Write requirements that describe problems, expected behaviours, inputs, outputs, and notable edge cases',
      'Collaborate with engineers on technical diagrams covering data flows, API interactions, and permissions logic',
      'Define acceptance criteria and test scenarios that can be executed by QA or engineering without ambiguity',
      'Review architecture options to understand performance, integration paths, and long-term implications',
      'Support engineers during implementation by clarifying open questions and adjusting details when needed',
      'Document critical decisions so the team has a stable reference for future development',
    ],
    proficiency: 93,
  },
  {
    id: 'go-to-market',
    title: 'Go-to-Market & Launch Enablement',
    description: [
      'Prepare demo environments, sample accounts, and realistic datasets to show the new product\'s value in a convincing, hands-on way during early pitches',
      'Set up event tracking, activation checkpoints, and core metrics so the first users can be monitored from the moment they touch the product',
      'Build simple onboarding flows, quick-start guides, and configuration defaults that reduce friction for the very first customers',
      'Train internal teams (support, sales, operations, founders if needed) on how to explain, configure, and troubleshoot the new product',
      'Draft clear external communication: landing page updates, product descriptions, FAQs, pricing logic, and usage examples that reflect the real functionality',
      'Coordinate staged rollout for early adopters: choosing who gets in first, gathering feedback rapidly, and adjusting capabilities before opening to wider traffic',
      'Prepare internal release notes and activation instructions so every involved team understands what is changing, why it matters, and how to support early users',
      'Monitor live usage, errors, drop-off points, and first-ticket patterns to adjust onboarding, explanations, pricing, or functionality during the first days and weeks',
    ],
    proficiency: 91,
  },
  {
    id: 'testing-validation',
    title: 'Testing & Validation',
    description: [
      'Prepare realistic test accounts, datasets, and scenarios mirroring real user behaviour',
      'Test the product end-to-end yourself: onboarding, main flows, failure states, and unusual combinations',
      'Track usage through logs, event data, funnels, or qualitative feedback to confirm hypotheses',
      'Compare actual results to expected outcomes and evaluate whether the release solved the intended problem',
      'Iterate quickly by adjusting or removing parts that do not deliver value',
      'Conduct post-release interviews with selected users to verify satisfaction and remaining pain points',
    ],
    proficiency: 89,
  },
  {
    id: 'scaling-optimization',
    title: 'Scaling, Optimisation & Governance',
    description: [
      'Simplify workflows or interfaces to reduce operational friction and configuration overhead',
      'Improve performance and reliability through targeted product and technical adjustments',
      'Introduce automation where manual work repeatedly slows down operations or support',
      'Establish product metrics, dashboards, and monitoring routines to maintain clarity at scale',
      'Manage long-term product health: prioritise debt, plan technical cleanup, and schedule deprecations',
      'Set clear ownership rules, documentation standards, and escalation paths for stable ongoing operations',
      'Review scaling patterns periodically to detect bottlenecks before they impact customers',
    ],
    proficiency: 87,
  },
]
