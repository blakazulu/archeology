# Archaeology Web App

A mobile-first web application for archaeological artifact documentation and preservation.

## Features

### Save The Past
Photograph archaeological finds from multiple angles to create:
- **3D Models** - AI-powered 3D reconstruction from photos
- **Digital Info Cards** - AI-generated artifact documentation including:
  - Discovery location & excavation layer
  - Material identification
  - Estimated age & historical period
  - Possible use & cultural significance
  - Preservation recommendations

### PastPalette
Explore multiple possible color reconstructions of artifacts:
- Based on pigments found at the site
- Based on historical period and culture
- Based on similar artifacts from other regions
- Interactive comparison between variants

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript + Vite |
| UI | Tailwind CSS + shadcn/ui |
| 3D Viewer | Three.js |
| Storage | IndexedDB (Dexie.js) |
| API Proxy | Netlify Functions |
| Hosting | Netlify |
| 3D AI | TRELLIS.2 / TripoSR (HuggingFace) |
| LLM | Groq (Llama 3.3 70B) |
| Colorization | DeOldify + SD ControlNet |

## Key Principles

- **Mobile-first** - Designed for field use on phones/tablets
- **Offline-first** - Works without internet, syncs when available
- **Local storage** - All data stored locally, no accounts required
- **AI transparency** - All AI-generated content clearly marked as speculative

## Documentation

- [Implementation Plan](./IMPLEMENTATION_PLAN.md) - Detailed development roadmap
- [Technical Research](./docs/final_technical_research.md) - API research and recommendations

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create a `.env.local` file:

```env
GROQ_API_KEY=your_groq_api_key
HF_API_TOKEN=your_huggingface_token  # optional
```

## License

This project is open source and available under the [MIT License](./LICENSE).

## Author

**lirazshaka** - [liraz@mypart.com](mailto:liraz@mypart.com)

---

*Built with AI assistance for archaeological preservation*
