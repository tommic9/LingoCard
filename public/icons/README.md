# PWA Icons

To generate PNG icons from the SVG:

1. Open icon.svg in a browser or image editor
2. Export as PNG at 192x192 and 512x512 sizes
3. Save as icon-192x192.png and icon-512x512.png

Or use ImageMagick:
```bash
magick icon.svg -resize 192x192 icon-192x192.png
magick icon.svg -resize 512x512 icon-512x512.png
```

Or use an online converter like https://cloudconvert.com/svg-to-png
