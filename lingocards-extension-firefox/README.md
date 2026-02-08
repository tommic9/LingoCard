# LingoCards Firefox Extension

Firefox WebExtension do dodawania słówek do LingoCards z dowolnej strony internetowej.

## Funkcjonalność

- ✅ Zaznacz słowo → PPM → "Dodaj do LingoCards"
- ✅ Automatyczne tłumaczenie EN→PL (MyMemory + LibreTranslate fallback)
- ✅ Dodawanie do User Deck (`user-deck-default`)
- ✅ Login w rozszerzeniu z Supabase auth
- ✅ Wykrywanie duplikatów
- ✅ Statystyki dodanych słówek

## Instalacja (Development)

### 1. Dodaj ikony

Rozszerzenie wymaga trzech ikon w katalogu `icons/`:
- `icon-16.png` (16×16 px)
- `icon-48.png` (48×48 px)
- `icon-128.png` (128×128 px)

**Opcja A**: Użyj favicon z aplikacji LingoCards
- Otwórz https://lingocards.netlify.app
- Zapisz favicon i zmień rozmiar na 16/48/128 px
- Umieść w `icons/`

**Opcja B**: Stwórz własne ikony
- Użyj dowolnego narzędzia do grafiki (Figma, GIMP, Photoshop, etc.)
- Stwórz proste ikony z logo "LC" lub książki
- Eksportuj jako PNG w trzech rozmiarach

**Opcja C**: Użyj placeholderów
```bash
# Możesz tymczasowo użyć dowolnych PNG jako placeholdery
# Rozszerzenie będzie działać, ale ikony mogą wyglądać źle
```

### 2. Załaduj rozszerzenie w Firefox

1. Otwórz Firefox
2. W pasku adresu wpisz: `about:debugging`
3. Kliknij "This Firefox" (Ten Firefox)
4. Kliknij "Load Temporary Add-on" (Wczytaj rozszerzenie tymczasowe)
5. Wybierz plik `manifest.json` z katalogu `lingocards-extension/`
6. Rozszerzenie zostanie załadowane (aktywne do zamknięcia Firefoksa)

### 3. Zaloguj się

1. Kliknij ikonę rozszerzenia LingoCards w pasku narzędzi
2. Wprowadź swoje dane logowania z LingoCards
3. Kliknij "Zaloguj się"

## Użytkowanie

1. Otwórz dowolną stronę internetową z angielskim tekstem
2. Zaznacz słowo lub frazę
3. Kliknij prawym przyciskiem myszy
4. Wybierz "Dodaj do LingoCards"
5. Poczekaj na notyfikację z potwierdzeniem

Słówko zostanie:
- Przetłumaczone automatycznie na polski
- Dodane do "My Cards" w LingoCards
- Widoczne w aplikacji web po odświeżeniu

## Struktura Projektu

```
lingocards-extension/
├── manifest.json              # WebExtension manifest (v3)
├── background.js              # Service worker (context menu)
├── icons/                     # Ikony (16, 48, 128 px)
├── popup/
│   ├── popup.html            # Popup UI (login + dashboard)
│   ├── popup.css             # Styling
│   └── popup.js              # Popup logic
├── lib/
│   ├── supabase-client.js    # Supabase initialization
│   ├── auth-manager.js       # Authentication
│   ├── card-service.js       # Card CRUD
│   └── translator.js         # Translation API
└── utils/
    ├── storage.js            # Browser storage wrapper
    ├── id-generator.js       # ID generation
    └── text-normalizer.js    # Duplicate detection
```

## Technologie

- **Manifest**: WebExtension v3 (Firefox compatible)
- **JavaScript**: ES6 modules (vanilla, no framework)
- **Supabase**: `@supabase/supabase-js` v2 (loaded from CDN)
- **APIs**: MyMemory Translation API, LibreTranslate

## Troubleshooting

### Rozszerzenie nie działa po restarcie Firefoksa
- To normalne. Temporary add-ons są usuwane po zamknięciu przeglądarki
- Załaduj ponownie przez `about:debugging`

### Błąd "Zaloguj się aby dodać słówko"
- Kliknij ikonę rozszerzenia i zaloguj się ponownie
- Token mógł wygasnąć (ważny 1 godzinę)

### Błąd tłumaczenia
- Sprawdź połączenie z internetem
- MyMemory API ma limit 50k znaków/dzień
- Rozszerzenie automatycznie przełączy się na LibreTranslate

### Błąd "Słówko już istnieje"
- Sprawdź w aplikacji LingoCards czy słówko nie jest już dodane
- Rozszerzenie wykrywa duplikaty (case-insensitive, bez znaków diakrytycznych)

### Console logs
- Kliknij prawym na ikonę rozszerzenia → "Inspect" aby otworzyć DevTools
- Przejdź do zakładki Console aby zobaczyć logi z background.js

## Publikacja (TODO)

### Firefox Add-ons (AMO)

1. Stwórz konto na https://addons.mozilla.org
2. Utwórz ZIP z całego katalogu `lingocards-extension/`
3. Upload do AMO
4. Poczekaj na review (1-7 dni)

### Self-hosting (.xpi)

```bash
# Package jako .xpi
cd lingocards-extension
zip -r ../lingocards-helper.xpi *

# Install w Firefox
# about:addons → Install Add-on From File → wybierz .xpi
```

## Rozwój (v2)

Planowane usprawnienia:
- [ ] Edycja tłumaczenia przed dodaniem (mini-popup)
- [ ] Context sentence (fragment tekstu ze strony)
- [ ] Bulk add (zaznacz wiele słów)
- [ ] Cache tłumaczeń (browser.storage.local)
- [ ] Keyboard shortcuts (Ctrl+Shift+A)
- [ ] Chrome/Edge support (Manifest v3 compatible)
- [ ] Dark mode w popup

## Licencja

MIT (zgodnie z projektem LingoCards)

## Autor

Rozszerzenie stworzone jako część projektu LingoCards.
