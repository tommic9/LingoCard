# LingoCards

A Progressive Web App (PWA) for learning English-Polish vocabulary using flashcards with SM-2 spaced repetition algorithm.

## Features

- **Spaced Repetition**: SM-2 algorithm for optimal learning intervals
- **Progressive Web App**: Installable on mobile and desktop, works offline
- **Built-in Vocabulary**: Pre-loaded English-Polish decks (A1, A2, B1 levels)
- **Local Storage**: All data stored locally using IndexedDB (Dexie.js)
- **Mobile-First**: Responsive design optimized for mobile devices
- **Dark Mode Support**: Light and dark themes

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Dexie.js** for IndexedDB storage
- **React Router v6** for navigation
- **vite-plugin-pwa** for PWA functionality

## Project Structure

```
LingoCards/
├── public/
│   └── icons/              # PWA icons
├── src/
│   ├── components/
│   │   ├── layout/         # Header, BottomNav, Layout
│   │   ├── cards/          # Flashcard components (Phase 2)
│   │   ├── decks/          # Deck management (Phase 2)
│   │   ├── study/          # Study session components (Phase 2)
│   │   └── import/         # CSV import (Phase 3)
│   ├── pages/              # Main page components
│   ├── data/               # Database and repository layer
│   ├── algorithms/         # SM-2 algorithm implementation
│   ├── types/              # TypeScript type definitions
│   ├── hooks/              # Custom React hooks
│   └── utils/              # Utility functions
└── Plan.md                 # Detailed project plan
```

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Generate PWA icons (requires sharp)
npm run generate-icons

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### First Run

On first launch, the app will automatically load built-in vocabulary decks:
- **Podstawy (A1)**: 50 most common English words
- **Codzienny angielski (A2)**: 50 everyday vocabulary words
- **Praca i biznes (B1)**: 50 business-related words

## Development Status

### Phase 1 - Foundation (COMPLETE)

- ✅ Vite project initialization with React + TypeScript + Tailwind CSS
- ✅ PWA configuration (manifest, service worker, icons)
- ✅ Data models and Dexie.js setup
- ✅ Repository abstraction layer (ready for Supabase migration)
- ✅ SM-2 algorithm implementation
- ✅ Basic routing and mobile-first layout
- ✅ Built-in vocabulary decks (seed data)
- ✅ Custom hooks (useDecks, useStudySession)
- ✅ Utility functions (date, CSV parser)

### Phase 2 - Core Features (Coming Soon)

- Flashcard component with flip animation
- Study session with SM-2 integration
- Rating buttons (Again, Hard, Good, Easy)
- Session completion screen
- Statistics dashboard

### Phase 3 - Card Management (Planned)

- Create/edit custom decks
- Add/edit individual cards
- CSV import functionality
- Data export

### Phase 4 - Polish & UX (Planned)

- Enhanced statistics and progress tracking
- Theme toggle
- Animations and transitions
- Offline support optimization

### Phase 5 - Supabase (Future)

- Cloud sync with Supabase
- User authentication
- Multi-device synchronization

## SM-2 Algorithm

The app uses the SuperMemo 2 (SM-2) spaced repetition algorithm:

- **Ratings**: 0-5 (simplified to 4 buttons in UI)
  - Again (0): Complete blackout
  - Hard (2): Correct with difficulty
  - Good (4): Correct after thought
  - Easy (5): Perfect, immediate recall

- **Intervals**:
  - First repetition: 1 day
  - Second repetition: 6 days
  - Subsequent: previous interval × ease factor

- **Ease Factor**: Starts at 2.5, adjusted based on performance

## Data Management

All data is stored locally in IndexedDB. The app provides:

- **Export**: Download all data as JSON
- **Clear Data**: Reset app to initial state
- **Load Built-in Decks**: Restore default vocabulary sets

## Architecture

The repository pattern provides abstraction for data access, making it easy to:
- Switch between local (IndexedDB) and cloud (Supabase) storage
- Test with mock data
- Maintain consistent API across storage backends

## License

This is a personal learning project.
