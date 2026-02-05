# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**LingoCards** is a Progressive Web App (PWA) for learning English-Polish vocabulary using flashcards with the SM-2 spaced repetition algorithm. All data is stored locally in IndexedDB (Dexie.js), with future support for cloud sync via Supabase.

**Current Phase:** Phase 3 (Card Management) complete. Phase 4 (UX Polish) and Phase 5 (Supabase) pending.

## Development Commands

```bash
# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Run TypeScript compiler check
tsc -b

# Preview production build
npm run preview

# Lint code
npm lint

# Run tests (watch mode)
npm test

# Run tests UI
npm test:ui

# Run tests once
npm test:run

# Generate PWA icons (requires sharp)
npm run generate-icons
```

## Project Architecture

### Core Layer Structure

1. **Types** (`src/types/index.ts`)
   - Central type definitions: `Deck`, `Card`, `ReviewLog`, `DeckStats`, `ReviewRating`
   - These types flow through all other layers

2. **Data Layer** (`src/data/`)
   - **repository.ts**: Interface definition (IRepository) - enables local/cloud abstraction
   - **local-repository.ts**: IndexedDB implementation using Dexie
   - **db.ts**: Dexie database schema and ID generation
   - Pattern: Repository implements interface, exported as singleton `repository`
   - All CRUD operations are async Promise-based

3. **Algorithm** (`src/algorithms/sm2.ts`)
   - SM-2 (SuperMemo 2) implementation
   - Key functions:
     - `calculateSM2()`: Computes next review interval based on rating (0-5)
     - `formatInterval()`: Converts days to human-readable format
     - `previewIntervals()`: Shows all 4 button outcomes before rating
   - Ease factor: Starts at 2.5, minimum 1.3
   - Intervals: 1 day → 6 days → exponential with ease factor

4. **Hooks** (`src/hooks/`)
   - **useDecks**: Load all decks, CRUD operations, stats with loading/error handling
   - **useDeck**: Load single deck by ID (follows same pattern as useDecks)
   - **useStudySession**: Manage study session state and SM-2 calculations
   - **useCardManagement**: User deck management + CRUD for custom cards + duplicate detection
   - Pattern: All hooks follow standard React patterns with useState/useEffect, exported directly
   - Each hook manages its own loading/error state and error logging

5. **Utilities** (`src/utils/`)
   - **csv-parser.ts**: Parse CSV files → CSVCard objects + error tracking
   - **duplicate-detector.ts**: Normalize text (NFD, lowercase, trim) + batch duplicate detection
   - **translator.ts**: LibreTranslate API integration with LRU cache (max 100 entries)
   - **date.ts**: Date manipulation utilities
   - Pattern: Pure functions exported individually, designed for composability

6. **Components** (`src/components/`)
   - **layout/**: Header, BottomNav, Layout wrapper (shared UI shell)
   - **cards/**: CardForm (manual entry), CardList, Flashcard (flip animation), CsvImport (bulk import), CsvPreview (preview table), DuplicateWarning (alert)
   - **decks/**: DeckCard, DeckList (display components)
   - **study/**: StudySession (main study flow), RatingButtons (4-button interface), StudyComplete (results)
   - Pattern: Components are functional, composed from smaller pieces, use custom hooks for state

7. **Pages** (`src/pages/`)
   - HomePage: Main deck list + stats
   - StudyPage: Study session for a deck
   - AddCardPage: Tab interface (manual entry / CSV import)
   - DeckPage: Deck details + cards
   - SettingsPage: Data management (export, clear, import)
   - Pattern: Pages use hooks for data, compose components, handle navigation

### Data Flow Example: Creating a Card

```
CardForm (component, user input)
  → useCardManagement hook (state + validation)
    → repository.checkDuplicate() (data layer)
    → repository.createCard() (data layer)
      → db.cards.add() (Dexie/IndexedDB)
  → DuplicateWarning (conditional alert)
  → Success message (callback)
```

## Key Architectural Decisions

### Repository Pattern
- **Why**: Abstraction layer allows switching IndexedDB ↔ Supabase without changing UI code
- **Where**: All data operations go through `src/data/repository.ts` interface
- **Impact**: Data layer is completely isolated; easy to mock for testing

### SM-2 Algorithm Integration
- **Where**: Calculated in hooks (`useStudySession`), stored on card model
- **Storage**: Card fields: `easeFactor`, `interval`, `repetitions`, `nextReviewDate`
- **Flow**: User rates card → calculateSM2() → updateCard() → stored in IndexedDB

### User Deck Auto-Creation
- **ID**: Constant `user-deck-default` (defined in `src/constants/user-deck.ts`)
- **When**: Created automatically on first card addition
- **Why**: Keeps user cards separate from built-in decks
- **Implementation**: `useCardManagement.ensureUserDeck()` handles creation

### CSV Bulk Import Strategy
- **Batch Size**: 50 cards per batch to prevent UI blocking
- **Duplicate Detection**: Normalized matching (case-insensitive, diacritics removed using Unicode NFD)
- **Flow**: Upload → Parse → Preview (with errors/duplicates highlighted) → User confirms → Batch import with progress
- **Caching**: Translation results cached (LRU, max 100 entries)

## Common Development Patterns

### Adding a New Hook
1. Create in `src/hooks/newHook.ts`
2. Follow pattern: `useState` for state, `useEffect` for side effects, `useCallback` for memoized functions
3. Return object with state + methods: `{ data, loading, error, methods }`
4. Export hook function directly (no default export)

### Adding a New Utility
1. Create in `src/utils/newUtil.ts`
2. Export pure functions, no side effects
3. Add to barrel export if creating helpers for specific feature

### Adding a New Component
1. Create in `src/components/feature/FeatureName.tsx`
2. Use TypeScript interfaces for props
3. Use custom hooks for state management (NOT useState directly in components when possible)
4. Import utilities/hooks, compose from smaller components
5. Follow TailwindCSS + dark mode patterns (see existing components)

### Dark Mode
- All components should support dark mode using TailwindCSS classes
- Pattern: `class="text-gray-900 dark:text-white"` for text, etc.
- No manual theme detection needed (CSS media query handles it)

### Error Handling
- Hooks catch errors and store in `error` state
- Components display errors from hooks using `error && <Alert>{error}</Alert>`
- Network errors: Log to console, show user-friendly message in UI
- Validation errors: Show immediately in form, clear when user corrects

## File Organization

```
src/
├── components/
│   ├── layout/          # Shell UI (Header, Nav, Layout)
│   ├── cards/           # Card-related (form, import, display)
│   ├── decks/           # Deck display components
│   └── study/           # Study session components
├── pages/               # Route components (HomePage, StudyPage, etc.)
├── data/                # Repository + DB layer
├── algorithms/          # SM-2 algorithm
├── hooks/               # Custom React hooks
├── types/               # TypeScript definitions (central)
├── utils/               # Utilities (csv, translator, duplicate, date)
├── constants/           # Constants (user-deck config)
├── App.tsx              # Root component + routing
└── index.css            # Global styles
```

## Build and Testing

### TypeScript
- Strict mode enabled (`tsconfig.app.json`)
- Build includes type checking: `npm run build` runs `tsc -b` first
- Fix type errors before committing; build must succeed

### Testing
- Framework: Vitest with React Testing Library
- Run: `npm test` (watch) or `npm test:run` (once)
- Coverage: Focus on hooks, utilities, and SM-2 algorithm
- Mocks: Mock `repository` for component tests

### PWA
- Generated by vite-plugin-pwa
- Icons: Auto-generated by `npm run generate-icons`
- Service worker handles offline + caching
- Manifest: Configured in `vite.config.ts`

## External APIs and Dependencies

### LibreTranslate (Translation)
- **URL**: `https://libretranslate.com/translate` (POST)
- **Rate Limiting**: None official, but be respectful
- **Fallback**: Mock mode for testing (set `USE_MOCK_MODE = true` in `translator.ts`)
- **Caching**: Implemented (LRU, max 100)
- **Timeout**: 5 seconds to prevent hanging

### Dexie.js (Database)
- Version: ^4.3.0
- Schema: Defined in `src/data/db.ts`
- Tables: `decks`, `cards`, `reviewLogs`
- Indices: Set on `deckId` and `nextReviewDate` for query performance

### React Router
- Version: ^7.13.0
- Pattern: BrowserRouter in App.tsx, Routes with path-based navigation
- Current routes: `/`, `/study/:deckId`, `/add-card`, `/settings`, `/deck/:deckId`

## Performance Considerations

1. **CSV Import**: Batched in chunks of 50 to keep UI responsive
2. **Caching**: Translation results cached (LRU) + duplicate checks optimized with Map
3. **IndexedDB**: Queries filtered by deckId for scalability
4. **PWA**: Service worker caches static assets + runtime caching for Google Fonts
5. **Gzip**: Production build optimized automatically by Vite

## Phase Roadmap

- **Phase 1** ✅: Foundation, routing, data models, SM-2 algorithm
- **Phase 2** ✅: Study components, flashcards, rating buttons, stats
- **Phase 3** ✅: Card management (manual + CSV import, auto-translate, duplicate detection)
- **Phase 4**: UX polish, theme toggle, animations
- **Phase 5**: Supabase cloud sync

## Git Workflow

- **Main branch**: Stable, production-ready code
- **Commits**: Descriptive messages, group related changes
- **PR workflow**: Not used (personal project), but commits should be atomic
- **Recent features**: Phase 3 (card management + CSV import) completed with full implementation

## Troubleshooting

### Build fails with TypeScript errors
- Run `tsc -b` to see all errors
- Check `tsconfig.app.json` for strict settings
- Ensure all imports are typed correctly

### Translation not working
- Check network connectivity (LibreTranslate API requires internet)
- Try mock mode: Set `USE_MOCK_MODE = true` in `src/utils/translator.ts`
- Check browser console for API errors

### Tests not running
- Ensure Vitest is installed: `npm install`
- Run `npm test:run` for non-interactive mode
- Check test file naming convention: `*.test.ts` or `*.spec.ts`

### IndexedDB issues
- Dexie auto-creates DB on first access
- To reset: Use Settings page "Clear Data" button
- Browser DevTools → Application → Storage → IndexedDB to inspect manually
