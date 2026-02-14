# 🚀 Deployment Guide

## Deploy to GitHub Pages

### Quick Setup (5 minutes)

1. **Create a new GitHub repository**
   - Go to https://github.com/new
   - Name: `iowa-city-quest` (or any name)
   - Public or Private
   - Don't initialize with README (we have one)

2. **Upload your files**
   
   Option A: Using Git command line
   ```bash
   cd iowa-city-quest-modular
   git init
   git add .
   git commit -m "Initial commit: Iowa City Quest"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/iowa-city-quest.git
   git push -u origin main
   ```

   Option B: Using GitHub Desktop
   - Open GitHub Desktop
   - File → Add Local Repository
   - Select the iowa-city-quest-modular folder
   - Publish to GitHub

   Option C: Drag and Drop on GitHub.com
   - Go to your new repository
   - Click "uploading an existing file"
   - Drag all files and folders
   - Commit changes

3. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to "Pages" section (left sidebar)
   - Source: Deploy from a branch
   - Branch: `main` (or `master`)
   - Folder: `/ (root)`
   - Click Save

4. **Wait 1-2 minutes** for deployment

5. **Access your game**
   ```
   https://YOUR-USERNAME.github.io/iowa-city-quest/
   ```

### Custom Domain (Optional)

1. Buy a domain (e.g., from Namecheap, Google Domains)
2. In GitHub repository Settings → Pages
3. Add custom domain: `iowacityquest.com`
4. Configure DNS at your domain provider:
   ```
   Type: A
   Host: @
   Value: 185.199.108.153
          185.199.109.153
          185.199.110.153
          185.199.111.153
   
   Type: CNAME
   Host: www
   Value: YOUR-USERNAME.github.io
   ```

## Alternative Hosting Options

### Netlify
1. Go to https://app.netlify.com
2. Drag and drop the `iowa-city-quest-modular` folder
3. Done! Get instant URL

### Vercel
1. Go to https://vercel.com
2. Import Git repository or upload folder
3. Deploy with one click

### Cloudflare Pages
1. Go to https://pages.cloudflare.com
2. Connect repository or upload files
3. Deploy

## Troubleshooting

### Game doesn't load
- **Problem**: Blank screen or console errors
- **Solution**: ES6 modules require HTTPS. GitHub Pages provides this automatically.
- **Check**: Open browser console (F12) for errors

### 404 on GitHub Pages
- **Problem**: `https://username.github.io/iowa-city-quest` shows 404
- **Solution**: 
  - Wait 2-3 minutes after enabling Pages
  - Check Settings → Pages shows "Your site is live"
  - Verify files are in root (not in a subfolder)

### Mobile controls don't work
- **Problem**: Touch buttons not responding
- **Solution**: 
  - Clear browser cache
  - Check if JavaScript is enabled
  - Try different mobile browser

### Module loading errors
- **Problem**: `Failed to load module script`
- **Solution**:
  - Ensure all .js files are in `js/` folder
  - Check file names match imports exactly (case-sensitive)
  - Verify server supports ES6 modules (GitHub Pages does)

## Testing Locally Before Deploy

```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

Then open: `http://localhost:8000`

## File Checklist

Before deploying, ensure you have:
- ✅ index.html
- ✅ game.css
- ✅ js/constants.js
- ✅ js/data.js
- ✅ js/quests.js
- ✅ js/enemies.js
- ✅ js/maps.js
- ✅ js/game-state.js
- ✅ js/main-working.js
- ✅ README.md
- ✅ LICENSE

## Update Your Game

To push updates:

```bash
git add .
git commit -m "Update: describe your changes"
git push
```

GitHub Pages will automatically redeploy in 1-2 minutes.

## Performance Tips

1. **Enable caching** - GitHub Pages does this automatically
2. **Minify files** (optional) - Use tools like Terser for JS
3. **Compress images** - If you add any in the future
4. **Use CDN** - GitHub Pages is already a CDN

## Support

If you have issues:
1. Check browser console (F12) for errors
2. Verify all files uploaded correctly
3. Test on multiple browsers
4. Check GitHub Pages status

---

🎮 Happy Deploying!
