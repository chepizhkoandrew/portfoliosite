export const freelanceExperience = {
  id: 'freelance',
  slug: 'freelance',
  title: 'Freelance Product Builder',
  company: 'Outsourcing of IT Development & Product Management',
  startYear: 2024,
  endYear: 2025,
  duration: '2024 - 2025',
  color: '#8b5cf6',
  overview: 'Several assignments for different clients across multiple industries',

  description: [],
  achievements: [],
  
  projects: [
    {
      id: 'blackthorn',
      name: 'Blackthorn Vision: Tax Advisory CRM',
      duration: '2 months',
      overview: 'Developed CRM prototype for tax advisory firm with client management, project tracking, and communication tools. Delivered a fully functional prototype that clarified requirements for production build.',
      url: 'https://blackthorn-vision.com/',
      videoUrl: 'https://res.cloudinary.com/dzhwsjuxy/video/upload/v1765553209/tax_advisory_prototype_uf0bcd.mp4',
      tags: ['Airtable', 'Softr', 'No-Code Development', 'Data Modeling', 'Prototyping', 'Client Interviews', 'UAT'],
      bulletPoints: [
        'Delivered a rapid discovery and prototyping phase for a tax advisory firm that initially had no clear requirements or validated use case. Conducted customer interviews to define core workflows and clarify the operational model.',
        'Built a fully functional no-code prototype in one week using Airtable and Softr, including real data structures, authentication, and role-specific interfaces for Tax Advisors and their clients.',
        'The prototype enabled the client to run early user testing, validate the concept, and align on the product scope. Based on this outcome, the outsourcing company secured a full-scale development engagement, with the prototype providing ~80% of the core logic for the production solution.'
      ],
      details: '',
    },
    {
      id: 'scrumlaunch',
      name: 'ScrumLaunch: Sports League Management App',
      duration: '2 months',
      overview: 'Built prototype app for organizing and managing sports leagues, including team management, scheduling, and scoring systems. Helped validate the product concept and scope for a larger development team.',
      url: 'https://www.scrumlaunch.com/',
      tags: ['Market Analysis', 'Competitor Research', 'SaaS Benchmarking', 'Data Modeling', 'Prototyping', 'Booking Systems', 'Tournament Logic'],
      details: '',
    },
    {
      id: 'casino-metrics',
      name: 'Casino Metrics Framework',
      duration: '1 month',
      overview: 'Created comprehensive metrics tree with 300+ potential KPIs, narrowed to 72 critical tracking metrics for data-driven operations. Improved data-driven decision making for online casino platform.',
      url: '',
      tags: ['Google Analytics', 'BigQuery', 'KPI Modeling', 'Market Research', 'Python', 'Data Structuring', 'Visualization (Kumu)'],
      bulletPoints: [
        'Completed a full overhaul of the client\'s product-analytics system. The work included auditing existing KPIs, Google Analytics event structures, and the underlying data-lake model used to track player behaviour and financial flows.',
        'Conducted market and competitor benchmarking using public reports and best practices from gaming, e-commerce, and mobile-app industries.',
        'Created a unified target framework of ~300 metrics with clear formulas, definitions, and hierarchical grouping. Facilitated a selection workshop that resulted in a final set of **72 key indicators** for ongoing tracking.',
        'Delivered documentation and guidance for product, analytics, and engineering teams to integrate the new metrics into dashboards, reporting, and data-model updates.'
      ],
      images: [
        'https://res.cloudinary.com/dzhwsjuxy/image/upload/v1765553418/casinmetrics3_poky5b.jpg',
        'https://res.cloudinary.com/dzhwsjuxy/image/upload/v1765553418/casinometrics2_hnofva.jpg',
        'https://res.cloudinary.com/dzhwsjuxy/image/upload/v1765553418/casinmetrics3_poky5b.jpg'
      ],
    },
    {
      id: 'kingmaker',
      name: 'Kingmaker: Deposit Flow Redesign',
      duration: '1 month',
      overview: 'Redesigned user deposit experience for casino platforms to improve conversion rates and reduce friction in payment flow. UX improvements led to measurable increases in deposit conversions.',
      url: 'http://kingmaker.com',
      tags: ['Competitive Analysis', 'UX Flow Mapping', 'Monetization Flows', 'Behavioral Triggers', 'Hypothesis Testing', 'Conversion Funnels', 'KPI Tree'],
      details: '',
    },
    {
      id: 'tribute',
      name: 'Tribute Technologies: E-commerce Commissions Module',
      duration: '4 months',
      overview: 'Built a complex commissions management system for a network of funeral homes and partner florists. Handled order fulfillment, multi-party commission calculations, and partner payments. The system needed to provide transparency at the order level so stakeholders could trace commissions back to their source.',
      url: '',
      tags: ['PostgreSQL', 'SQL', 'Commission Logic', 'System Refactoring', 'Requirements Analysis', 'User Interviews', 'Financial Workflows'],
      details: '',
    },
    {
      id: 'madrid-ai',
      name: 'Generative AI: Character-Consistent Content Pipeline',
      duration: '1 week',
      overview: 'Built an experimental content-creation pipeline using ComfyUI and cloud-hosted LoRA training. Trained a custom model on 150 photos to generate a consistent digital character ("madridthedog") for use in social media imagery and creative scenarios.',
      url: '',
      tags: ['ComfyUI', 'LoRA Training', 'Replicate', 'HuggingFace', 'Model Fine-Tuning', 'Image Pipelines', 'Generative AI'],
      images: [
        'https://res.cloudinary.com/dzhwsjuxy/image/upload/v1765557078/madrid_the_model_jetrra.jpg',
        'https://res.cloudinary.com/dzhwsjuxy/image/upload/v1765557078/madrid_the_model_jetrra.jpg'
      ],
      details: '### Generative AI Content Creation Pipeline (Experimental Project)\n\nAn experimental project exploring early-generation AI tooling for automated content production. The goal was to evaluate the feasibility of building a consistent, end-to-end visual-content workflow using open-source and cloud-hosted models.\n\n#### 1. Image-Generation Pipelines (ComfyUI + Local Models)\n\nTested several ComfyUI pipelines for:\n- Local execution of open-source image-generation models\n- Image transformation workflows\n- Multi-step sequences for style transfer, prompt-based variation, and controlled outputs\n\nThe focus was on understanding model behaviour, resource constraints, and achievable quality on consumer hardware.\n\n#### 2. Character-Consistency Model Training (Replicate)\n\nUsed Replicate — a paid cloud service for training and hosting ML models — to train a lightweight LoRA model capable of producing **consistent character imagery** of a specific dog ("madridthedog").\n\nThe workflow included:\n- Preparing ~150 curated training photos\n- Training a LoRA adapter for the FLUX-dev model\n- Validating whether the model could preserve identity features across different poses, scenes, and compositions\n\nThe result was a fully reusable character-consistency model that could be embedded into any prompt and reliably reproduce the same character in diverse scenarios.\n\n#### 3. Practical Application\n\nThe trained model was used to generate:\n- Social-media imagery\n- Creative scenes and stylised compositions\n- Character-based content without requiring manual reference images\n\nThe experiment demonstrated the effectiveness of custom LoRA training over general-purpose chat-based generators, particularly in situations where **identity consistency** is required.\n\n---\n\n### Summary\n\nThis project validated that:\n- Open-source tools like ComfyUI can support modular, controllable visual pipelines.\n- Cloud platforms like Replicate enable fast LoRA training without significant infrastructure overhead.\n- Custom LoRA models outperform general-purpose generators in use cases requiring **consistency and identity preservation**.\n\nAlthough the project was exploratory and didn\'t lead to a production deployment, it provided valuable insights into AI tooling maturity and the operational workflows needed to support AI-driven content creation at scale.',
    },
  ],

  detailedContent: ``,
}
