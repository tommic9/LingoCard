# ✅ Checklist Instalacji LingoCards Extension

## Przed Instalacją

- [ ] Masz zainstalowany **Firefox** (wersja 109+)
- [ ] Masz konto w **LingoCards** (https://lingocards.netlify.app)
- [ ] Znasz swoje **dane logowania** (email + hasło)

## Instalacja - Krok po kroku

### 1. Przygotowanie ikon

- [ ] Otworzyłem `icons/generate-icons.html` w przeglądarce
- [ ] Kliknąłem "Generuj i pobierz ikony"
- [ ] Pobrałem 3 pliki PNG:
  - [ ] `icon-16.png`
  - [ ] `icon-48.png`
  - [ ] `icon-128.png`
- [ ] Przeniosłem te pliki do `lingocards-extension/icons/`
- [ ] Upewniłem się, że pliki są w `icons/` (obok `icon.svg`)

### 2. Instalacja w Firefox

- [ ] Otworzyłem Firefox
- [ ] Wpisałem w pasku adresu: `about:debugging`
- [ ] Kliknąłem "This Firefox" (Ten Firefox) w lewym menu
- [ ] Kliknąłem "Load Temporary Add-on..." (Wczytaj rozszerzenie tymczasowe)
- [ ] Wybrałem plik `manifest.json` z folderu `lingocards-extension/`
- [ ] Rozszerzenie się załadowało (ikona w pasku narzędzi)

### 3. Logowanie

- [ ] Kliknąłem ikonę LingoCards w pasku narzędzi
- [ ] Zobaczyłem popup z formularzem logowania
- [ ] Wprowadziłem swój email
- [ ] Wprowadziłem swoje hasło
- [ ] Kliknąłem "Zaloguj się"
- [ ] Zobaczyłem dashboard z moim emailem

### 4. Pierwszy Test

- [ ] Otworzyłem angielską stronę (np. https://en.wikipedia.org)
- [ ] Zaznaczyłem słowo (np. "apple")
- [ ] Kliknąłem **prawym przyciskiem myszy**
- [ ] Wybrałem "Dodaj do LingoCards" z menu
- [ ] Zobaczyłem notyfikację: "Dodano: 'apple' → 'jabłko'"

### 5. Weryfikacja w Aplikacji

- [ ] Otworzyłem https://lingocards.netlify.app
- [ ] Zalogowałem się (jeśli nie byłem zalogowany)
- [ ] Kliknąłem "Browse" lub "My Cards"
- [ ] Zobaczyłem nową kartę "apple" → "jabłko"

---

## ✅ Gotowe!

Jeśli wszystkie checkboxy są zaznaczone, rozszerzenie działa poprawnie! 🎉

---

## ⚠️ Problemy?

### Ikony się nie wyświetlają
- [ ] Sprawdziłem czy pliki PNG są w `icons/` (nie w `Downloads/`)
- [ ] Sprawdziłem czy nazwy plików są dokładnie: `icon-16.png`, `icon-48.png`, `icon-128.png`
- [ ] Przeładowałem rozszerzenie (about:debugging → Reload)

### Nie mogę się zalogować
- [ ] Sprawdziłem czy email i hasło są poprawne
- [ ] Sprawdziłem czy mam połączenie z internetem
- [ ] Spróbowałem zalogować się w aplikacji web (https://lingocards.netlify.app)
- [ ] Jeśli to nie działa, zresetowałem hasło w aplikacji web

### Menu PPM nie pojawia się
- [ ] Sprawdziłem czy tekst jest zaznaczony
- [ ] Przeładowałem rozszerzenie (about:debugging → Reload)
- [ ] Zrestartowałem Firefoksa

### Błąd tłumaczenia
- [ ] Sprawdziłem połączenie z internetem
- [ ] Spróbowałem ponownie za chwilę (API może być przeciążone)
- [ ] Sprawdziłem Console logs (PPM na ikonie → Inspect → Console)

### Karta nie pojawia się w aplikacji
- [ ] Odświeżyłem stronę aplikacji web (F5)
- [ ] Sprawdziłem czy jestem zalogowany na to samo konto
- [ ] Sprawdziłem "My Cards" lub zakładkę "Browse"

---

## 🐛 Debugging

Jeśli nic nie działa:

1. **Otwórz Console Logs**:
   - Kliknij **prawym** na ikonę rozszerzenia
   - Wybierz **"Inspect"**
   - Przejdź do zakładki **"Console"**
   - Szukaj czerwonych błędów

2. **Sprawdź Permissions**:
   - about:debugging → LingoCards Helper
   - Sprawdź czy permissions są przyznane

3. **Reinstall**:
   - about:debugging → Remove extension
   - Załaduj ponownie (Load Temporary Add-on)

---

## 📞 Pomoc

- Zobacz: `INSTALL.md` - Szczegółowe instrukcje
- Zobacz: `README.md` - Pełna dokumentacja
- Zobacz: `SUMMARY.md` - Podsumowanie implementacji

---

**Miłego uczenia się! 🇵🇱🇬🇧**
