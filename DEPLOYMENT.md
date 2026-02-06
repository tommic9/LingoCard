# LingoCards Deployment Guide

## Deploy to Netlify (Recommended)

### Prerequisites
- GitHub account
- Netlify account (free tier is fine)
- Supabase project (already created)

### Step 1: Push to GitHub

```bash
# If not already on GitHub, create repo and push
git remote add origin https://github.com/YOUR_USERNAME/lingocards.git
git push -u origin main
```

### Step 2: Connect to Netlify

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and authorize
4. Select your **lingocards** repository
5. Netlify will auto-detect settings from `netlify.toml`

### Step 3: Configure Environment Variables

In Netlify dashboard:
1. Go to **Site settings** → **Environment variables**
2. Add these variables (get values from your Supabase project):

```
VITE_SUPABASE_URL = <your-supabase-project-url>
VITE_SUPABASE_ANON_KEY = <your-supabase-anon-key>
```

**Where to find these values:**
- Go to your Supabase Dashboard → Project Settings → API
- Copy "Project URL" and "anon public" key

### Step 4: Deploy!

1. Click **"Deploy site"**
2. Wait ~2 minutes for build
3. Your site will be live at: `https://your-site-name.netlify.app`

### Step 5: Custom Domain (Optional)

1. **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow instructions to configure DNS

---

## Alternative: Deploy to Vercel

### Quick Deploy

```bash
npm install -g vercel
vercel login
vercel
```

Follow prompts and add environment variables when asked.

---

## Alternative: Deploy to GitHub Pages

**Note:** GitHub Pages doesn't support server-side rendering, but PWA works fine.

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to `package.json`:
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

3. Deploy:
```bash
npm run deploy
```

---

## Post-Deployment Checklist

- [ ] Test login/signup on live site
- [ ] Add cards and verify Supabase sync
- [ ] Test PWA install (Add to Home Screen)
- [ ] Test offline mode
- [ ] Update Supabase Redirect URLs:
  - Go to Supabase Dashboard → Authentication → URL Configuration
  - Add your Netlify URL to **Redirect URLs**: `https://your-site.netlify.app/**`

---

## Troubleshooting

### Build fails on Netlify
- Check build log for errors
- Ensure `netlify.toml` is committed
- Node version: Netlify uses Node 18 by default (compatible)

### Environment variables not working
- Make sure they start with `VITE_` prefix
- Redeploy after adding variables

### Supabase auth redirect issues
- Add your Netlify URL to Supabase Redirect URLs
- Check browser console for auth errors

### PWA not installing
- Ensure HTTPS is enabled (Netlify does this automatically)
- Check manifest.webmanifest is accessible
- Clear browser cache and try again

---

## Performance Tips

- Netlify automatically enables CDN
- PWA caches assets for offline use
- Consider enabling Netlify Analytics for usage insights
