# LingoCards Browser Extension

Add English words to your LingoCards flashcards directly from any webpage.

## Installation

### Chrome
1. `chrome://extensions/` → Enable Developer mode
2. **Load unpacked** → select `lingocards-extension` folder
3. **Rename `manifest-chrome.json` to `manifest.json` first**

### Firefox  
1. `about:debugging` → Load Temporary Add-on
2. Select `manifest-firefox.json` directly OR rename to `manifest.json`

## Usage
1. Click extension icon → login
2. Select text → right-click → "Dodaj do LingoCards"

## Structure
- `chrome/` - Chrome service worker
- `firefox/` - Firefox background page
- `lib/`, `popup/`, `icons/`, `utils/` - Shared code
