# 🦊 Instalacja LingoCards Firefox Extension

## Krok 1: Wygeneruj ikony

1. Otwórz plik `icons/generate-icons.html` w przeglądarce (powinien być już otwarty)
2. Kliknij przycisk **"Generuj i pobierz ikony"**
3. Pobiorą się 3 pliki PNG:
   - `icon-16.png`
   - `icon-48.png`
   - `icon-128.png`
4. **Przenieś** te pliki do katalogu `lingocards-extension/icons/`
   - Upewnij się, że są dokładnie w katalogu `icons/` (obok `icon.svg`)

## Krok 2: Załaduj rozszerzenie w Firefox

1. Otwórz **Firefox**
2. W pasku adresu wpisz: **`about:debugging`**
3. W menu po lewej kliknij **"This Firefox"** (Ten Firefox)
4. Kliknij przycisk **"Load Temporary Add-on..."** (Wczytaj rozszerzenie tymczasowe)
5. Przejdź do katalogu `lingocards-extension/`
6. Wybierz plik **`manifest.json`**
7. Kliknij **"Otwórz"**

✅ Rozszerzenie jest załadowane! Powinna pojawić się ikona LingoCards w pasku narzędzi.

## Krok 3: Zaloguj się

1. **Kliknij** ikonę LingoCards w pasku narzędzi Firefoksa
2. Otworzy się popup z formularzem logowania
3. **Wprowadź** swoje dane logowania z LingoCards:
   - Email
   - Hasło
4. Kliknij **"Zaloguj się"**

✅ Po zalogowaniu zobaczysz dashboard z liczbą dodanych słówek.

## Krok 4: Przetestuj rozszerzenie

1. Otwórz dowolną stronę internetową z **angielskim tekstem** (np. Wikipedia EN, BBC News)
2. **Zaznacz** słowo lub frazę (np. "hello", "apple", "beautiful")
3. Kliknij **prawym przyciskiem myszy** na zaznaczonym tekście
4. Z menu kontekstowego wybierz **"Dodaj do LingoCards"**
5. Poczekaj 2-3 sekundy
6. Pojawi się **notyfikacja** z potwierdzeniem:
   - ✅ Sukces: `"Dodano do LingoCards: 'apple' → 'jabłko'"`
   - ❌ Duplikat: `"Słówko 'apple' już istnieje w Twoich fiszkach"`
   - ❌ Błąd: `"Nie udało się przetłumaczyć słowa..."`

## Krok 5: Sprawdź w aplikacji LingoCards

1. Otwórz **https://lingocards.netlify.app**
2. Zaloguj się (jeśli nie jesteś zalogowany)
3. Kliknij **"Browse"** w dolnym menu
4. Lub otwórz **"My Cards"** na stronie głównej
5. Twoje nowe słówko powinno być widoczne! 🎉

---

## ⚠️ Ważne informacje

### Temporary Add-on (Tymczasowe rozszerzenie)
- Rozszerzenie zostanie **usunięte** po zamknięciu Firefoksa
- Po restarcie przeglądarki musisz **załadować je ponownie** (Krok 2)
- To jest normalne dla dev mode w Firefoxie

### Sesja wygasa po 1 godzinie
- Jeśli zobaczysz błąd "Sesja wygasła", po prostu:
  1. Kliknij ikonę rozszerzenia
  2. Zaloguj się ponownie

### Limity API tłumaczeń
- **MyMemory**: 50,000 znaków/dzień (główne API)
- **LibreTranslate**: Backup (automatyczny fallback)

---

## 🐛 Troubleshooting

### Ikony się nie wyświetlają
- Upewnij się, że pliki `icon-16.png`, `icon-48.png`, `icon-128.png` są w `icons/`
- Sprawdź czy nazwy plików są dokładnie takie (lowercase, z myślnikiem)

### Błąd "Zaloguj się aby dodać słówko"
- Kliknij ikonę rozszerzenia i zaloguj się
- Sprawdź czy wprowadzasz poprawne dane

### Błąd podczas tłumaczenia
- Sprawdź połączenie z internetem
- Spróbuj ponownie za chwilę (API może być przeciążone)

### Console logs (debugging)
1. Kliknij **prawym** przyciskiem na ikonę rozszerzenia
2. Wybierz **"Inspect"**
3. Przejdź do zakładki **"Console"**
4. Zobaczysz logi z `background.js`

---

## ✅ Gotowe!

Rozszerzenie jest gotowe do użycia. Ciesz się szybkim dodawaniem słówek! 🎉

**Tip**: Zaznaczaj słówka podczas czytania artykułów, oglądania filmów z napisami, itp. To najlepszy sposób na naukę w kontekście!
