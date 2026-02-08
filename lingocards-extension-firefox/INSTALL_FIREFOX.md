# Install LingoCards Extension - Firefox

## Firefox (Manifest V2)

Firefox requires `manifest_firefox.json` to be renamed to `manifest.json`.

### Option 1: Temporary Installation (for testing)

1. Open Firefox and go to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Navigate to `lingocards-extension` folder
4. Select `manifest_firefox.json`
5. Extension will work until you restart Firefox

### Option 2: Permanent Installation (requires Firefox Developer Edition or Nightly)

1. Rename `manifest_firefox.json` to `manifest.json` (backup the Chrome version first)
2. Go to `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on**
4. Select `manifest.json`

## Login

1. Click the LingoCards extension icon
2. Enter your LingoCards email and password
3. Click "Zaloguj się"

## Usage

1. Select any English text on a webpage
2. Right-click → **"Dodaj do LingoCards"**
3. Extension will translate the text and open LingoCards /add page
4. Add example and save the card

## Troubleshooting

### "background.html" not found
- Make sure `background.html` exists in the extension folder
- Check that `lib/supabase.umd.js` is present

### Login fails
- Check browser console for errors (F12)
- Verify Supabase URL and anon key in `lib/supabase-client.js`

### Translation fails
- Check internet connection
- MyMemory API may have rate limits (50k/day free tier)
