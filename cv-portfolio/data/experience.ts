export interface ExperienceLink {
  text: string
  url: string
}

export interface ExperienceVideo {
  title: string
  youtubeId: string
  description?: string
}

export interface Experience {
  id: string
  title: string
  company: string
  startYear: number
  endYear: number | null
  duration: string
  description: string[]
  achievements?: string[]
  type: 'founder' | 'freelance' | 'lead_po' | 'pm' | 'lead_ba' | 'consultant'
  color: string
  companyUrl?: string
  logo?: string
  links?: ExperienceLink[]
  videos?: ExperienceVideo[]
}

export const experiences: Experience[] = [
  {
    id: 'myproduct',
    title: 'Startup Founder',
    company: 'priroda.tech',
    startYear: 2025,
    endYear: null,
    duration: '2025 - now',
    type: 'founder',
    color: '#10b981',
    logo: '/experienceicons/priroda.png',
    description: [
      'Digital operations system for the flower shops business',
      'Addressing urgent digitalization needs for retail business in Spain (*Verifactu)',
      'Developing product, testing with clients, managing marketing and operational/regulatory steps for launch in Spain',
    ],
  },
  {
    id: 'freelance',
    title: 'Freelance Product Builder',
    company: 'Outsourcing of IT Development & Product Management',
    startYear: 2024,
    endYear: 2025,
    duration: '2024 - 2025 (1 year)',
    type: 'freelance',
    color: '#8b5cf6',
    logo: '/experienceicons/freelance.png',
    description: [
      'Several assignments for different clients',
    ],
    links: [
      { text: 'ScrumLaunch', url: 'https://www.scrumlaunch.com/' },
      { text: 'Blackthorn Vision', url: 'https://blackthorn-vision.com/' },
      { text: 'Tribute Technologies', url: 'https://www.tributetech.com/' },
      { text: 'Kingmaker', url: 'http://kingmaker.com' },
    ],
  },
  {
    id: 'lead_po',
    title: 'Lead Product Owner',
    company: 'Boosta - EdTech (online tutoring platform)',
    startYear: 2023,
    endYear: 2024,
    duration: '2023 - 2024 (1 year)',
    type: 'lead_po',
    color: '#f59e0b',
    logo: '/experienceicons/boosta.png',
    description: [
      'Reduced cycle time (4 months→6 weeks) of new products and major features release',
      'Organized 3 scrum teams, cleared and reprioritized backlogs',
      'Re-launched SDLC flow for 3x faster development and release of new product sites',
    ],
    companyUrl: 'https://boosta.biz/',
    links: [
      { text: 'PapersOwl', url: 'https://papersowl.com' },
      { text: 'EduBirdie', url: 'https://edubirdie.com' },
      { text: 'MySuperGeek', url: 'https://mysupergeek.com' },
    ],
  },
  {
    id: 'roboticspm',
    title: 'Product Manager',
    company: 'Takeoff Technologies (US)',
    startYear: 2019,
    endYear: 2023,
    duration: '2019 - 2023 (3 years)',
    type: 'pm',
    color: '#06b6d4',
    logo: '/experienceicons/takeoff.png',
    description: [
      'Led product scalability initiatives in e-grocery automation (B2B SaaS)',
      'Managed 2 scrum teams daily, worked with grocery shop network clients',
      'Reduced retailer onboarding from ~3 months to 3-4 weeks (3x improvement)',
    ],
    videos: [
      {
        title: 'TakeOff Technologies Product Demo',
        youtubeId: 'MkjkP5xsBNw',
        description: 'See the technology and product in action'
      }
    ],
    links: [
      { text: 'Detailed Work Presentation', url: 'https://docs.google.com/presentation/d/1xpm3mZBh8x3RLvNOWsgS3Q7RUoIyTAePjoXVw1CzK0I/edit?usp=sharing' }
    ],
  },
  {
    id: 'lead_ba',
    title: 'Lead Business Analyst',
    company: 'Eleks LLC (Kernel - Ukrainian Agricultural Company)',
    startYear: 2017,
    endYear: 2019,
    duration: '2017 - 2019 (2 years)',
    type: 'lead_ba',
    color: '#ec4899',
    logo: '/experienceicons/eleks.png',
    description: [
      'Managed 50+ IT engineers for agricultural planning system',
      'Coordinated system for 7,500 fields and 12,000 machine fleet',
      'Responsible for scope, logic, and client expectations',
    ],
    companyUrl: 'https://eleks.com/',
    videos: [
      {
        title: 'Kernel Project Overview',
        youtubeId: 'dzAuINeog4w',
        description: 'Understanding the agricultural technology project (starts at 3:45)'
      }
    ],
  },
  {
    id: 'consultant',
    title: 'Operational Business Consultant',
    company: 'EY - Business Consulting',
    startYear: 2011,
    endYear: 2016,
    duration: '2011 - 2016 (5 years)',
    type: 'consultant',
    color: '#6366f1',
    logo: '/experienceicons/ey.png',
    description: [
      '13 different projects across Ukraine and Kazakhstan',
      'Operational consultancy for major corporate clients: banks, government institutions, factories',
      'Helped top-management reduce operational costs, frame processes, and plan IT automations',
    ],
    companyUrl: 'https://www.ey.com/en_ua/consulting',
  },
]
