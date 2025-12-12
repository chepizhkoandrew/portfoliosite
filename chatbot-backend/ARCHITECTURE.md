# Advanced Chatbot Architecture Plan

## 1. User Segmentation & Detection

### Purpose
Identify user type on first interaction to tailor responses and propositions.

### User Types & Behaviors
```
RECRUITER:
  - Keywords: "hire", "position", "job", "CV", "salary", "team size"
  - Props: Focus on team leadership, enterprise projects, SDLC optimization
  - Facts needed: Team sizes led, enterprise clients, technical depth in hiring
  
BUSINESS OWNER/STARTUP:
  - Keywords: "build", "launch", "SaaS", "product", "market", "investors"
  - Props: Focus on execution, product launch speed, monetization, scaling
  - Facts needed: Time-to-market achievements, products launched, revenue impact
  
AGENCY/CONSULTANT:
  - Keywords: "collaboration", "partnership", "services", "engagement", "project"
  - Props: Focus on past collaborations, methodologies, domains worked
  - Facts needed: Partnership outcomes, delivery models, client industries
  
CASUAL VISITOR:
  - Keywords: Portfolio visit, no specific intent in first message
  - Props: General overview, call-to-action to other sections
  - Facts needed: Executive summary, contact methods

```

### Detection Mechanism
- **First Message Analysis**: Parse initial message for intent keywords
- **Conversation History**: Update user type as more context emerges
- **Fallback**: Start generic, shift strategy as conversation reveals intent
- **Storage**: Keep user_type in conversation context for consistency

---

## 2. Proposition Detection & Scenario Framing

### Conversation Scenarios
```
SCENARIO: "Recruitment Opportunity"
- Andrii is positioned as: Technical leader, culture builder, executive
- Facts emphasized: Team leadership, technical decisions, enterprise scale
- Questions to ask: "What team size?", "What challenges?"
- Conversion goal: Schedule call / Send CV

SCENARIO: "Product Building / Launch"
- Andrii is positioned as: Product strategist, execution expert, growth driver
- Facts emphasized: Time-to-market, product launches, SaaS platforms
- Questions to ask: "What stage?", "What's your biggest blocker?"
- Conversion goal: Schedule consultation

SCENARIO: "Partnership / Services"
- Andrii is positioned as: Experienced collaborator, domain expert
- Facts emphasized: Past partnerships, deliverables, industry expertise
- Questions to ask: "What's the scope?", "Timeline?"
- Conversion goal: Discuss engagement model

SCENARIO: "General Learning / Portfolio"
- Andrii is positioned as: Approachable professional, available for questions
- Facts emphasized: Career journey, skill development, lessons learned
- Questions to ask: "What interests you most?"
- Conversion goal: Direct to deeper resources or contact

```

---

## 3. Knowledge Base Architecture

### Option A: Markdown Files (Recommended for Fact Accuracy)
```
/knowledge-base/
├── profile/
│   ├── bio.md                    # Executive summary
│   ├── contact.md                # All contact methods
│   └── quick-facts.md            # Key stats
│
├── experience/
│   ├── 01-business-analyst.md    # BA role details, companies, achievements
│   ├── 02-product-manager.md     # PM role details, products launched
│   ├── 03-founder.md             # Founder experience if any
│   └── 04-leadership.md          # Team leadership experience
│
├── achievements/
│   ├── time-to-market.md         # 3x faster releases (DOCUMENTED)
│   ├── onboarding.md             # 3 months -> 3-4 weeks (DOCUMENTED)
│   ├── products-launched.md      # 5+ products with details
│   └── team-leadership.md        # Teams led, outcomes
│
├── skills/
│   ├── product-strategy.md       # Methodology, frameworks, case studies
│   ├── system-design.md          # Architectures designed, scale handled
│   ├── sdlc-optimization.md      # Processes, tools, improvements
│   ├── team-leadership.md        # Management philosophy, team size
│   └── technical-skills.md       # Tech stack, depth
│
├── industries/
│   ├── ecommerce.md              # Companies, scale, problems solved
│   ├── edtech.md                 # EdTech experience, outcomes
│   ├── fintech.md                # Banking/Finance projects
│   ├── agritech.md               # Agriculture tech
│   ├── gaming.md                 # Gaming/iGaming
│   └── beauty-retail.md          # Beauty & Retail
│
└── scenarios/
    ├── for-recruiters.md         # What recruiters care about
    ├── for-business-owners.md    # What business owners care about
    └── for-partners.md           # Partnership positioning
```

### File Format Standard
```markdown
# [Topic Name]

## Overview
[Clear definition and context]

## Key Metrics
- Metric 1: Value (Source/Date)
- Metric 2: Value (Source/Date)

## Evidence & Examples
- Example 1: Detail
- Example 2: Detail

## Related Experience
- Link to other fact files

## Interview Talking Points
- Point 1: How to explain
- Point 2: How to explain
```

### Option B: Vector Database (for future speed)
- Primary storage: MD files (source of truth)
- Vector DB (Pinecone/Weaviate): Embeddings of MD content for semantic search
- Sync: Daily batch or event-driven from MD updates
- Benefits: Fast retrieval at scale, semantic search for nuance

**Recommendation**: Start with **MD files + smart RAG retrieval** (Option A). Move to vector DB when you have 50+ files or need multi-language support.

---

## 4. Multi-Agent Validation System

### Agent Architecture

```
USER MESSAGE
    ↓
┌───────────────────────────────────────┐
│  INTENT DETECTOR AGENT                 │
│  - Classify user type                  │
│  - Identify proposition                │
│  - Extract key entities                │
└────────────────┬────────────────────────┘
                 ↓
┌───────────────────────────────────────┐
│  CONTEXT & KB RETRIEVER AGENT          │
│  - Load relevant MD files              │
│  - Get conversation history            │
│  - Identify scenario                   │
└────────────────┬────────────────────────┘
                 ↓
┌───────────────────────────────────────┐
│  COMMUNICATION AGENT (LLM)             │
│  - Generate response based on:         │
│    * User type & proposition           │
│    * Scenario framing                  │
│    * Retrieved facts                   │
│    * Conversation history              │
│  - System prompt includes facts + rules│
└────────────────┬────────────────────────┘
                 ↓
┌───────────────────────────────────────┐
│  VALIDATION AGENT                      │
│  Checks:                               │
│  1. FACTUALITY: Does it match KB docs?│
│  2. STYLE: Matches scenario tone?      │
│  3. RELEVANCE: Answers the question?   │
│  4. PERSUASION: Positions correctly?   │
│  5. SAFETY: No contradictions/claims?  │
│                                         │
│  If FAILS: Reject + regenerate         │
│  If PASSES: Return to user             │
└────────────────┬────────────────────────┘
                 ↓
           USER RECEIVES RESPONSE
```

### Agent Specifications

#### 1. Intent Detector Agent
```python
Input:
  - Current message
  - Conversation history

Output:
  {
    "user_type": "recruiter|business_owner|agency|casual",
    "proposition": "recruitment|product_build|partnership|learning",
    "confidence": 0.0-1.0,
    "key_entities": ["job title", "company", "etc"],
    "conversation_tone": "formal|casual|technical"
  }

Logic:
  - Keyword matching (hardcoded)
  - Pattern recognition
  - Conversation history analysis
```

#### 2. Context & KB Retriever Agent
```python
Input:
  - Intent classification
  - Current message
  - Conversation history

Output:
  {
    "relevant_facts": [
      {"file": "experience/02-product-manager.md", "content": "..."},
      {"file": "achievements/time-to-market.md", "content": "..."}
    ],
    "scenario_context": "Product Building",
    "suggested_tone": "Strategic, execution-focused"
  }

Logic:
  - Load all MD files from /knowledge-base/
  - Use similarity matching or semantic search
  - Rank by relevance to user type + proposition
  - Max 3-5 most relevant files
```

#### 3. Communication Agent (Existing with Enhanced Prompt)
```python
System Prompt Structure:

[ROLE & CONTEXT]
"You are Andrii's AI representative. Andrii is a Digital Product Builder..."

[USER PROFILE]
"The person you're talking to is a: {user_type}"
"They're interested in: {proposition}"

[SCENARIO INSTRUCTIONS]
"In this conversation about {scenario}:
- Emphasize: [facts from KB]
- Your tone should be: [tone]
- Your goal is to: [conversion goal]
- DO NOT claim anything about: [things not in KB]"

[FACTS TO USE]
"Here are verified facts about Andrii to reference:
{relevant_facts_from_kb}"

[RULES]
"1. Only state facts that appear in the knowledge base
2. If asked about something not in KB, say 'I don't have that specific info'
3. Be natural and conversational, not robotic
4. Guide conversation toward: {next_action}
5. If uncertain, suggest direct contact: {contact_info}"

[CONVERSATION HISTORY]
{history}

[CURRENT MESSAGE]
{user_message}
```

#### 4. Validation Agent
```python
Input:
  - Generated response
  - KB facts
  - User intent
  - Scenario rules

Validation Checks:

1. FACTUALITY CHECK:
   - Extract all factual claims from response
   - Match against KB files
   - Flag: Claims not in KB → REJECT
   - Flag: Contradicts KB → REJECT
   - Pass: Only KB-backed facts → ACCEPT

2. STYLE CHECK:
   - Tone matches scenario? (formal/casual/technical)
   - Andrii's voice consistent?
   - Appropriate for user type?
   - Too salesy / too robotic? → ADJUST

3. RELEVANCE CHECK:
   - Does response answer the question?
   - Avoids going off-topic?
   - Maintains context awareness?

4. PERSUASION CHECK:
   - For recruitment scenario: Emphasizes leadership/team?
   - For product scenario: Emphasizes execution/scale?
   - For partnership: Emphasizes collaboration/reliability?

5. SAFETY CHECK:
   - No contradictions within response?
   - No "I heard" or "People say"?
   - No speculation?
   - Confident only where justified?

Output:
  {
    "status": "ACCEPT|REJECT|REVISE",
    "factuality_score": 0.0-1.0,
    "style_score": 0.0-1.0,
    "relevance_score": 0.0-1.0,
    "issues": ["issue1", "issue2"],
    "feedback": "What to fix if REVISE"
  }

If REJECT/REVISE:
  → Send feedback back to Communication Agent with instructions
  → Regenerate with constraints
  → Re-validate (max 3 retries)
```

---

## 5. Implementation Flow

### Request Processing
```
1. User sends message
   ↓
2. Intent Detector analyzes
   ↓
3. KB Retriever loads relevant facts
   ↓
4. Communication Agent generates response WITH KB facts in prompt
   ↓
5. Validation Agent checks response
   ↓
6. If VALID: Return to user
   If INVALID: Regen with feedback (retry loop)
   ↓
7. Log conversation with classification for future learning
```

### Backend Architecture Changes
```
Current: main.py handles simple chat

New:
chatbot-backend/
├── main.py                    # FastAPI routes
├── agents/
│   ├── intent_detector.py     # User type classification
│   ├── kb_retriever.py        # Knowledge base loading
│   ├── communication.py       # LLM response generation
│   └── validator.py           # Response validation
├── knowledge-base/            # MD files
│   └── [structure as above]
├── schemas/
│   ├── user_profile.py        # User type schema
│   ├── response_validation.py # Validation response schema
│   └── conversation.py        # Enhanced conversation schema
└── utils/
    ├── kb_loader.py           # Load MD files
    └── prompt_builder.py      # Build system prompts dynamically
```

---

## 6. Data Storage & Conversation Memory

### Enhanced Conversation Schema
```python
{
  "conversation_id": "uuid",
  "user_id": "ip_hash or session_id",
  "created_at": "timestamp",
  "user_type": "recruiter|business_owner|...",
  "proposition": "recruitment|product_build|...",
  "scenario": "Which scenario active",
  "messages": [
    {
      "id": "msg_id",
      "role": "user|assistant",
      "content": "text",
      "timestamp": "timestamp",
      "user_type_at_message": "detected type at this point",
      "validation_result": {...},  # For assistant messages
      "kb_refs": ["experience/02.md", ...]  # What KB was used
    }
  ],
  "metadata": {
    "total_exchanges": 5,
    "user_satisfaction": "not_measured_yet",
    "last_action_suggested": "schedule_call"
  }
}
```

---

## 7. Phased Implementation

### Phase 1: Foundation (Week 1)
- [x] Create KB folder structure with sample files
- [ ] Build Intent Detector agent (simple keyword matching)
- [ ] Build KB Retriever (load MD files, basic similarity)
- [ ] Enhance system prompt with KB facts
- [ ] Test with backend

### Phase 2: Validation (Week 2)
- [ ] Build Validation Agent with 5-point check
- [ ] Implement retry loop (max 3 attempts)
- [ ] Add validation logging
- [ ] Test edge cases (hallucination attempts)

### Phase 3: Polish (Week 3)
- [ ] Fine-tune prompts for each scenario
- [ ] Add conversation memory persistence
- [ ] Create admin dashboard to view validations
- [ ] A/B test different prompts

### Phase 4: Advanced (Future)
- [ ] Vector DB integration (Pinecone/Weaviate)
- [ ] Semantic search instead of keyword matching
- [ ] Conversation analytics
- [ ] A/B testing framework

---

## 8. Success Metrics

- **Hallucination Rate**: 0% (validated against KB)
- **Response Quality Score**: 90%+ (validation agent pass rate)
- **User Engagement**: Completion of desired action (call scheduled / info requested)
- **Conversation Length**: 4-7 exchanges (sweet spot for positioning)
- **User Satisfaction**: Explicit feedback (add survey after chat)

---

## 9. Knowledge Base Content Requirements

For each of 20 MD files, include:

1. **Concrete Numbers**: Quantified achievements (3x faster, 50+ engineers, 5 products)
2. **Dates & Context**: When, where, with whom
3. **Impact Statement**: What changed as a result
4. **Proof Points**: Measurable outcomes or client testimonials
5. **Relevance Tags**: Which user types care about this (recruiter/business_owner/etc)

Example structure for one file:
```markdown
# 3x Faster Product Releases Through SDLC Optimization

## Overview
Implemented SDLC process improvements that resulted in 3x faster product release cycles.

## Context
- Company: [Name] (E-commerce)
- Timeline: 2020-2021
- Team Size: 25 engineers
- Industry: E-grocery retail

## The Problem
- Release cycle: 3-4 months
- High friction between teams
- Manual QA bottlenecks

## The Solution
- Implemented CI/CD pipeline (Github Actions + Docker)
- Introduced automated testing (80% coverage)
- Weekly sprint cycles instead of quarterly releases
- Team training on agile methodologies

## Results
- Release frequency: 3 months → 4 weeks (7.5x improvement)
- Defect rate: Reduced by 40%
- Team morale: Improved deployment confidence

## Key Techniques Used
1. Infrastructure as Code
2. Automated testing layers
3. Kanban-based workflow
4. Cross-team communication rituals

## Relevance
- For Recruiters: Shows technical acumen + team management
- For Business Owners: Shows efficiency mindset + process expertise
- For Partners: Shows delivery reliability

## Interview Talking Points
- "We started with quarterly releases and moved to weekly deployments"
- "The key wasn't just tools, it was mindset shift in the team"
- "This process is now standard in every team I work with"
```

---

## Questions for Your Review

1. **Knowledge Base Format**: MD files or Vector DB from start?
   - Recommendation: Start with MD (simpler, more auditable)

2. **Validation Strictness**: Should we regenerate until perfect or accept "good enough"?
   - Recommendation: 3-retry limit, then return best attempt with confidence score

3. **User Detection**: How important is accuracy vs speed?
   - Recommendation: Start basic (keywords), improve with history

4. **Scenario Handling**: Should we explicitly ask "Are you a recruiter?" or detect naturally?
   - Recommendation: Detect naturally, offer clarification option

5. **Hallucination Prevention**: Accept "I don't know" answers?
   - Recommendation: Yes, with suggestion to contact directly

---

## Next Steps (Once Approved)

1. You review and provide feedback
2. We finalize KB structure and create initial 20 MD files
3. We implement agents in order: Intent Detector → KB Retriever → Communication → Validator
4. We test end-to-end with sample conversations
5. We deploy and monitor for issues

