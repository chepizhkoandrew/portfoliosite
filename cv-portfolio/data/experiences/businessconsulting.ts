export const businessconsultingExperience = {
  id: 'consultant',
  slug: 'consultant',
  title: 'Operational Business Consultant',
  company: 'EY - Business Consulting',
  startYear: 2011,
  endYear: 2016,
  duration: '2011 - 2016',
  color: '#6366f1',
  logo: '/experienceicons/ey.png',
  overview: '13 different projects across Ukraine and Kazakhstan',

  description: [
    '13 different projects across Ukraine and Kazakhstan',
    'Operational consultancy for major corporate clients: banks, government institutions, factories',
    'Helped top-management reduce operational costs, frame processes, and plan IT automations',
  ],

  detailedContent: `
## Areas of Expertise

- **IT systems design**
- **Process optimization and change management**
- **KPI system development**
- **Building business intelligence dashboards**
- **Implementing budget control procedures**
- **Organization of project management offices**

## Industries

- Corporate banking
- Government sector
- Agro
- Retail
  `,

  projects: [
    {
      id: 'mining-investments',
      name: 'Capital Investments & Project Management - Ukrainian Mining Complex (Ferrexpo)',
      overview: 'Transformation of the capital investments management and project management processes for a large Ukrainian mining complex. The goals were to improve budgeting and resource planning procedures and align the investment management system with supply chain and procurement processes. Delivered full set of process maps with job descriptions, prototypes of budget sheets, and functional requirements for automation.',
      tags: ['Process Mapping', 'Budget Modeling', 'Investment Management', 'Systems Design'],
    },
    {
      id: 'agrarian-farms',
      name: 'Agrarian Farm Process Mapping & Transformation (IFC)',
      overview: 'Project funded by the International Finance Corporation with the goal of creating standard operating models for three Ukrainian farms of different scale, to be shared as best practices for the sector. Served as PM for one of the participating farms, managing project execution and delivery of models to IFC.',
      tags: ['Agro', 'Process Optimization', 'Project Management', 'Best Practices'],
    },
    {
      id: 'risk-management',
      name: 'Risk Management Redesign - VTB Bank (Kazakhstan, Basel II)',
      overview: 'Risk management function redesign according to Basel II requirements for VTB Bank. Worked closely with bank staff providing project management and expertise for redesigning risk management components and processes. Responsibilities included development of credit risk processes and tools, profitability management processes, and alignment of budgeting and control functions.',
      tags: ['Risk Management', 'Banking', 'Basel II Compliance', 'Process Design'],
    },
    {
      id: 'growth-optimization',
      name: 'Process Optimization - Risk, Finance & Operations - VTB Bank (Kazakhstan)',
      overview: 'The bank\'s management wanted to assess readiness for growth. Analysed all processes within major functions, proposed target organizational structure, identified growth risks, and recommended improvements for process automation. Responsible for methodology of modelling and calculations, and analysis of the Operations stream.',
      tags: ['Process Optimization', 'Analytics', 'Organizational Design', 'Growth Strategy'],
    },
    {
      id: 'fleet-management',
      name: 'Cost Reduction - Real Estate & Car Fleet Management (Prominvestbank Ukraine)',
      overview: 'Analysed the bank\'s car fleet and building usage. Based on observations, proposed improvements for the asset and facilities management structure, including business cases and implementation roadmap. Responsible for the fleet management workstream.',
      tags: ['Cost Reduction', 'Asset Management', 'Facilities Management', 'Analytics'],
    },
    {
      id: 'food-factory',
      name: 'Business Process Identification & ERP System Selection - Food Factory (Dnipropetrovsk, Ukraine)',
      overview: 'Visualized all supply chain and production processes in flowcharts and developed functional requirements for each stage and user interface elements. Enabled informed ERP system selection and implementation planning.',
      tags: ['Process Visualization', 'ERP Selection', 'Requirements Engineering', 'System Design'],
    },
    {
      id: 'finance-ministry',
      name: 'System Selection & Treasury Process Design - Ministry of Finance Ukraine (World Bank)',
      overview: 'Project funded by the World Bank aiming to automate budgetary and treasury processes for the State Budget and local budgets. Developed full set of RFP documents, functional and technical requirements, process descriptions, and demonstration scenarios for core budget system components. Responsible for treasury module design.',
      tags: ['Government', 'Treasury Systems', 'Requirements Documentation', 'RFP Development'],
    },
  ],

  companyUrl: 'https://www.ey.com/en_ua/consulting',

  skills: [
    'Automation',
    'Systems Design',
    'Digital Transformation',
    'Analytics',
    'ERP Systems',
    'System Integration',
    'BPMN Modelling',
    'KPI Frameworks',
    'Data Workflows',
  ],
}
