export interface Profile {
  name: string
  title: string
  location: string
  locationUrl: string
  email: string
  phone: string
  website: string
  personalAssistant: string
  intro: string
  bio: {
    firstLine: string
    secondLine: string
  }
  social: {
    linkedin: string
    whatsapp: string
    telegram: string
    github: string
    instagram: string
  }
}

export const profile: Profile = {
  name: 'Andrii Chepizhko',
  title: 'Digital Product Builder',
  location: 'Galicia, Spain',
  locationUrl: 'https://maps.app.goo.gl/iupA7y6RZMTozL8m9',
  email: 'andrii.chepizhko@gmail.com',
  phone: '+34611371682',
  website: 'https://andriichepizhko.online',
  personalAssistant: 'https://andriichepizhko.online/chatbot',
  intro: 'From business consulting to building AI-powered IT systems. 14+ years of experience transforming ideas into working products.',
  bio: {
    firstLine: '13 years of Business Analyst and PM experience, dealing with both complex enterprise and B2C markets.',
    secondLine: 'I can build and launch IT products, from idea to a working solution.',
  },
  social: {
    linkedin: 'https://www.linkedin.com/in/andrii-chepizhko-1914265b/',
    whatsapp: 'https://wa.me/34611371682',
    telegram: 'https://t.me/andriichep',
    github: 'https://github.com/chepizhkoandrew',
    instagram: 'https://www.instagram.com/madrid_the_dog/',
  },
}

export const personalInfo = profile
export const contactInfo = {
  email: profile.email,
  phone: profile.phone,
  linkedin: profile.social.linkedin,
  whatsapp: profile.social.whatsapp,
  telegram: profile.social.telegram,
  github: profile.social.github,
  instagram: profile.social.instagram,
  location: profile.location,
  locationUrl: profile.locationUrl,
}

export const skills = {
  core: [
    'Product Strategy',
    'Product Management',
    'Business Analysis',
    'System Design',
    'Team Leadership',
    'SDLC Optimization',
  ],
  technical: [
    'SaaS Platform Development',
    'E-commerce Solutions',
    'Data Analytics',
    'UI/UX Design',
    'Agile & Scrum',
    'Stakeholder Management',
  ],
  industries: [
    'E-grocery & Retail',
    'EdTech',
    'Finance & Banking',
    'Agriculture Tech',
    'Gaming & iGaming',
    'Beauty & Retail',
  ],
}

export const summary = {
  headline: 'Turning Ideas Into Working Solutions',
  subheadline: '14+ years from consulting to full-stack product building',
  highlights: [
    '3x faster product releases through SDLC optimization',
    'Reduced retailer onboarding from 3 months to 3-4 weeks',
    'Built 5+ products from concept to market launch',
    'Led teams of 50+ engineers',
    'Worked across 13+ different projects and industries',
  ],
}

export const socialLinks = [
  {
    name: 'LinkedIn',
    url: profile.social.linkedin,
    icon: '🔗',
  },
  {
    name: 'WhatsApp',
    url: profile.social.whatsapp,
    icon: '💬',
  },
  {
    name: 'Telegram',
    url: profile.social.telegram,
    icon: '✈️',
  },
  {
    name: 'GitHub',
    url: profile.social.github,
    icon: '💻',
  },
  {
    name: 'Instagram',
    url: profile.social.instagram,
    icon: '📸',
  },
  {
    name: 'Email',
    url: `mailto:${profile.email}`,
    icon: '📧',
  },
]

export const pageConfig = {
  title: 'Andrii Chepizhko - CV Portfolio',
  description: 'Interactive CV with career timeline and professional journey',
  showHeader: true,
  showContactInfo: true,
  showBio: true,
  animationsEnabled: true,
}
