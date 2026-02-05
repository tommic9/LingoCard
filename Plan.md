# LingoCards — Plan projektu

## Opis
Aplikacja do nauki angielskiego (EN-PL) w formie fiszek z algorytmem powtórek SM-2.
PWA — działa w przeglądarce na Windows i instalowalna na Androidzie.

## Stack technologiczny
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Bundler**: Vite
- **PWA**: vite-plugin-pwa (Workbox)
- **Storage**: IndexedDB (via Dexie.js) — lokalnie, z abstrakcją gotową pod Supabase
- **Routing**: React Router v6

## Struktura projektu

```
LingoCards/
├── public/
│   ├── icons/                  # Ikony PWA (192x192, 512x512)
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   └── Layout.tsx
│   │   ├── cards/
│   │   │   ├── Flashcard.tsx       # Komponent fiszki (flip animation)
│   │   │   ├── CardForm.tsx        # Formularz dodawania/edycji karty
│   │   │   └── CardList.tsx        # Lista kart w zestawie
│   │   ├── decks/
│   │   │   ├── DeckList.tsx        # Lista zestawów
│   │   │   ├── DeckForm.tsx        # Tworzenie/edycja zestawu
│   │   │   └── DeckCard.tsx        # Kafelek zestawu na liście
│   │   ├── study/
│   │   │   ├── StudySession.tsx    # Sesja nauki
│   │   │   ├── StudyComplete.tsx   # Ekran zakończenia sesji
│   │   │   └── RatingButtons.tsx   # Przyciski oceny (Again/Hard/Good/Easy)
│   │   └── import/
│   │       └── CsvImport.tsx       # Import z CSV
│   ├── pages/
│   │   ├── HomePage.tsx            # Dashboard — statystyki + zestawy
│   │   ├── DeckPage.tsx            # Widok zestawu z kartami
│   │   ├── StudyPage.tsx           # Sesja nauki
│   │   ├── AddCardPage.tsx         # Dodawanie kart
│   │   └── SettingsPage.tsx        # Ustawienia + import/eksport
│   ├── data/
│   │   ├── repository.ts          # Abstrakcja dostępu do danych (interfejs)
│   │   ├── local-repository.ts    # Implementacja lokalna (Dexie/IndexedDB)
│   │   ├── db.ts                  # Konfiguracja Dexie.js
│   │   └── seed-data.ts           # Wbudowane zestawy fiszek EN-PL
│   ├── algorithms/
│   │   └── sm2.ts                 # Algorytm SM-2 (spaced repetition)
│   ├── types/
│   │   └── index.ts               # Typy TypeScript (Card, Deck, Review, etc.)
│   ├── hooks/
│   │   ├── useStudySession.ts     # Hook do sesji nauki
│   │   └── useDecks.ts            # Hook do zarządzania zestawami
│   ├── utils/
│   │   ├── csv-parser.ts          # Parser CSV
│   │   └── date.ts                # Pomocnicze funkcje dat
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                  # Tailwind base + custom styles
├── Plan.md
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## Modele danych

```typescript
interface Deck {
  id: string;
  name: string;
  description: string;
  isBuiltIn: boolean;       // true = wbudowany zestaw
  createdAt: Date;
  updatedAt: Date;
}

interface Card {
  id: string;
  deckId: string;
  front: string;             // Angielski (lub pytanie)
  back: string;              // Polski (lub odpowiedź)
  example?: string;          // Przykładowe zdanie
  // SM-2 fields
  easeFactor: number;        // domyślnie 2.5
  interval: number;          // w dniach
  repetitions: number;       // liczba powtórek
  nextReviewDate: Date;      // kiedy powtórka
  createdAt: Date;
  updatedAt: Date;
}

interface ReviewLog {
  id: string;
  cardId: string;
  rating: 0 | 1 | 2 | 3 | 4 | 5;   // SM-2 rating
  reviewedAt: Date;
}
```

## Algorytm SM-2

Implementacja SuperMemo 2:
- Oceny: 0-5 (w UI uproszczone do 4 przycisków: Again=0, Hard=2, Good=4, Easy=5)
- `easeFactor` = max(1.3, EF + (0.1 - (5-q) * (0.08 + (5-q) * 0.02)))
- Interwały: 1 dzień → 6 dni → EF * poprzedni interwał
- Jeśli ocena < 3: reset repetitions, interwał = 1

## Fazy implementacji

### Faza 1 — Fundament (MVP)
1. Inicjalizacja projektu (Vite + React + TS + Tailwind)
2. Konfiguracja PWA (manifest, service worker, ikony)
3. Modele danych + baza Dexie.js
4. Warstwa repository (abstrakcja pod Supabase)
5. Algorytm SM-2
6. Podstawowy routing i layout (mobile-first)

### Faza 2 — Core Features
7. Lista zestawów (DeckList) z wbudowanymi fiszkami
8. Widok zestawu z listą kart
9. Komponent fiszki z animacją flip
10. Sesja nauki z SM-2 + przyciski oceny
11. Ekran podsumowania sesji

### Faza 3 — Zarządzanie kartami
12. Formularz dodawania/edycji kart
13. Tworzenie własnych zestawów
14. Import CSV (format: front,back,example)
15. Eksport danych

### Faza 4 — Polish & UX
16. Dashboard ze statystykami (karty do powtórki, streak, postęp)
17. Ustawienia (reset postępu, motyw)
18. Animacje i przejścia
19. Obsługa offline (cache strategia)
20. Testy

### Faza 5 — Supabase (przyszłość)
21. Migracja repository na Supabase
22. Autentykacja użytkowników
23. Synchronizacja między urządzeniami

## Wbudowane zestawy (seed data)

Początkowe zestawy EN-PL:
- **Podstawy (A1)** — ~50 najczęstszych słów
- **Codzienny angielski (A2)** — ~50 słów z życia codziennego
- **Praca i biznes (B1)** — ~50 słów biznesowych

## Format importu CSV

```csv
front,back,example
hello,cześć,"Hello, how are you?"
goodbye,do widzenia,"Goodbye, see you tomorrow!"
```

## Design

- Mobile-first, responsywny
- Ciemny/jasny motyw (Tailwind dark mode)
- Animacja flip karty (CSS 3D transform)
- Bottom navigation na mobile
- Kolory: primary indigo, accent emerald
