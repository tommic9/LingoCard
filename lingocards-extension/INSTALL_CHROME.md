# Install LingoCards Extension - Chrome

## Chrome (Manifest V3)

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `lingocards-extension` folder
5. The extension icon should appear in your toolbar

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

### "Service worker registration failed"
- Make sure you selected the correct folder
- Try removing and re-adding the extension

### "Wymagane logowanie" when right-clicking
- Click the extension icon and login first
- Check that your session hasn't expired

### Translation fails
- Check internet connection
- MyMemory API may have rate limits (50k/day free tier)
