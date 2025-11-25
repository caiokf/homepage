# Tech Radar

A Vue 3 + TypeScript application with D3.js and d3-tip for data visualization.

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Typed JavaScript
- **D3.js** - Data visualization library
- **d3-tip** - Tooltip plugin for D3
- **Vite** - Fast build tool and dev server

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Type Checking

Run TypeScript type checking:

```bash
npm run type-check
```

## Project Structure

```
.
├── src/
│   ├── components/     # Vue components
│   │   └── D3Chart.vue # Example D3 chart component with tooltips
│   ├── App.vue         # Root component
│   ├── main.ts         # Application entry point
│   ├── style.css       # Global styles
│   └── vite-env.d.ts   # TypeScript declarations
├── index.html          # HTML entry point
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## Example Component

The `D3Chart.vue` component demonstrates:
- D3.js integration with Vue 3
- d3-tip tooltip implementation
- Responsive SVG charts
- Interactive data visualization

You can modify this component or create new ones following the same pattern.

## License

MIT

