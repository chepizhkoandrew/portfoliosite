# Andrii Chepizhko - Interactive CV Portfolio

An interactive, multi-layered CV visualization built with **Next.js**, **React**, **Framer Motion**, and **Tailwind CSS**. Features a beautiful "helicopter view" with animated planets representing different career stages.

## Features

- **Helicopter View**: Animated timeline with career experiences displayed as interactive planets
- **Multiple Zoom Levels**: 
  - Roadmap: Full career timeline
  - Detailed: Key achievements
  - Deep Dive: Full descriptions
- **Interactive Elements**: Click on planets to explore detailed information
- **Beautiful Animations**: Smooth transitions and floating effects using Framer Motion
- **Responsive Design**: Works seamlessly on desktop and tablet devices
- **Modern Tech Stack**: Built with latest Next.js 16, React 19, and Tailwind CSS v4

## Project Structure

```
cv-portfolio/
├── app/
│   ├── globals.css        # Global styles and animations
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main page
├── components/
│   └── HelicopterView.tsx # Main interactive visualization component
├── data/
│   └── experience.ts      # Career experience data
├── public/                # Static assets
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
cd cv-portfolio
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the portfolio.

The page auto-updates as you edit files.

### Build for Production

```bash
npm run build
npm run start
```

## Customization

### Update Experience Data

Edit `data/experience.ts` to modify your career experiences:

```typescript
export const experiences: Experience[] = [
  {
    id: 'unique-id',
    title: 'Job Title',
    company: 'Company Name',
    startYear: 2020,
    endYear: 2021,
    duration: '2020 - 2021',
    type: 'founder' | 'freelance' | 'lead_po' | 'pm' | 'lead_ba' | 'consultant',
    color: '#hexcolor',
    description: ['Achievement 1', 'Achievement 2', ...],
  },
  // ... more experiences
]
```

### Customize Colors and Styles

- Edit `app/globals.css` for global styles
- Update `tailwind.config.js` for Tailwind theme customization
- Modify component styles directly in `components/HelicopterView.tsx`

### Add More Zoom Levels

In `components/HelicopterView.tsx`, update the `zoomLevels` array:

```typescript
const zoomLevels: ZoomLevel[] = [
  { scale: 1, label: 'Roadmap', description: 'Full career timeline' },
  { scale: 1.5, label: 'Detailed', description: 'Key achievements' },
  { scale: 2.5, label: 'Deep Dive', description: 'Full descriptions' },
  // Add more zoom levels here
]
```

## Key Technologies

- **Next.js 16**: Modern React framework with Turbopack
- **React 19**: Latest React with concurrent rendering
- **Framer Motion**: Powerful animation library
- **Tailwind CSS v4**: Utility-first CSS framework
- **TypeScript**: Type-safe development
- **PostCSS**: CSS processing with Tailwind

## Browser Support

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Performance Optimizations

- Static generation for fast initial load
- Optimized animations with GPU acceleration
- Lazy loading of interactive elements
- CSS-in-JS for efficient styling

## License

This project is your personal portfolio. Customize and deploy as needed.

## Future Enhancements

- [ ] Add more detailed project showcase
- [ ] Implement contact form
- [ ] Add dark/light theme toggle
- [ ] Create downloadable CV PDF
- [ ] Add skill visualization
- [ ] Implement filtering by experience type
- [ ] Add search functionality

## Support

For issues or questions, feel free to modify the code directly. The project is fully customizable!
