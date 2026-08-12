# INSTALLATION & SETUP GUIDE
## Panduan Lengkap Setup & Menjalankan SIS-TERPADU

---

## 📋 DAFTAR ISI
1. [System Requirements](#system-requirements)
2. [Pre-Installation Checklist](#pre-installation-checklist)
3. [Step-by-Step Installation](#step-by-step-installation)
4. [Development Server](#development-server)
5. [Project Structure Verification](#project-structure-verification)
6. [First Time Setup](#first-time-setup)
7. [Common Issues & Solutions](#common-issues--solutions)
8. [Building for Production](#building-for-production)

---

## SYSTEM REQUIREMENTS

### Minimum Requirements
```
OS: Windows 7+, macOS 10.12+, Ubuntu 16.04+
RAM: 2 GB
Storage: 500 MB free space
```

### Required Software

**Node.js & npm**
```bash
# Check if installed
node --version    # Should be >= 18.0
npm --version     # Should be >= 9.0

# If not installed:
# Windows: Download from https://nodejs.org
# macOS: brew install node
# Linux: sudo apt install nodejs npm
```

**Git (Optional but recommended)**
```bash
# For cloning repository
git --version     # Should be >= 2.0

# If not installed:
# Windows: Download from https://git-scm.com
# macOS: brew install git
# Linux: sudo apt install git
```

**Text Editor/IDE (Recommended)**
```
Visual Studio Code (Recommended)
  → Download: https://code.visualstudio.com
  → Recommended extensions:
     • ESLint
     • Prettier
     • Tailwind CSS IntelliSense
     • TypeScript Vue Plugin (Volar)
     • Thunder Client (API testing)

Alternative IDEs:
  • WebStorm (Full-featured)
  • Sublime Text (Lightweight)
  • Vim/Neovim (Advanced)
```

---

## PRE-INSTALLATION CHECKLIST

Before starting, verify:

- [ ] Node.js installed (`node --version` shows >= 18.0)
- [ ] npm installed (`npm --version` shows >= 9.0)
- [ ] Git installed (optional: `git --version`)
- [ ] Internet connection available
- [ ] At least 500 MB free disk space
- [ ] Administrator access (may be needed for npm global packages)
- [ ] Port 8080 is available (development server will use this)

---

## STEP-BY-STEP INSTALLATION

### Step 1: Clone Repository

**Option A: Using Git (Recommended)**
```bash
# Open terminal/command prompt
cd Desktop                # Or any directory you prefer

# Clone the repository
git clone https://github.com/Izhar2005/web-jurnal-mengajar
cd web-jurnal-mengajar

# Verify you're in the right directory
ls                        # On macOS/Linux
dir                       # On Windows
# Should show: src, public, package.json, README.md, etc
```

**Option B: Download as ZIP**
```
1. Go to https://github.com/Izhar2005/web-jurnal-mengajar
2. Click "Code" → "Download ZIP"
3. Extract the ZIP file
4. Open terminal in extracted folder
```

### Step 2: Install Dependencies

```bash
# Navigate to project directory
cd web-jurnal-mengajar

# Install all npm packages
npm install

# This will take 2-5 minutes
# Downloads ~500 MB of node_modules
```

**What happens:**
```
npm install:
├─ Reads package.json
├─ Downloads all dependencies (React, Vite, etc)
├─ Installs transitive dependencies
├─ Creates node_modules/ folder (~400-500 MB)
├─ Generates package-lock.json
└─ Ready for development
```

**Troubleshooting npm install:**
```bash
# If install fails, try:

# 1. Clear npm cache
npm cache clean --force

# 2. Delete node_modules and reinstall
rm -rf node_modules package-lock.json    # On macOS/Linux
rmdir /s node_modules & del package-lock.json  # On Windows
npm install

# 3. Use different npm registry
npm install --registry https://registry.npmjs.org

# 4. Check Node version (must be >= 18)
node --version
```

### Step 3: Verify Installation

```bash
# Check all files are present
npm list

# Should show tree of installed packages

# Verify key files exist
cat package.json          # Should show dependencies

# On Windows:
type package.json
```

Expected structure after install:
```
web-jurnal-mengajar/
├── node_modules/       ← Downloaded dependencies
├── src/
├── public/
├── package.json
├── package-lock.json   ← Auto-generated lockfile
├── vite.config.ts
├── tsconfig.json
└── ... (other config files)
```

---

## DEVELOPMENT SERVER

### Starting the Server

```bash
# From project root directory
npm run dev

# Output should look like:
# ➜ Local:   http://localhost:8080/
# ➜ Press h to show help
```

### Accessing the Application

Open browser and go to:
```
http://localhost:8080
```

### Server Features

✅ **Hot Module Reload (HMR)**
- Changes to code automatically reload browser
- Preserve component state
- No need to refresh manually

✅ **Fast Compilation**
- First load: ~3-5 seconds
- Subsequent changes: ~100-500ms

✅ **Error Overlay**
- Syntax errors shown in browser
- Full stack trace
- Helpful error messages

### Stopping the Server

```bash
# Press Ctrl+C in terminal
^C

# Or close terminal window
```

### Common Server Issues

```bash
# If port 8080 is already in use:
# Find process using port 8080
netstat -tlnp | grep 8080  # Linux/macOS
netstat -ano | findstr :8080  # Windows

# Kill process
kill -9 <PID>  # Linux/macOS
taskkill /PID <PID> /F  # Windows

# Or start on different port (edit vite.config.ts)
```

---

## PROJECT STRUCTURE VERIFICATION

After installation, verify project structure:

```bash
# List top-level directories
ls -la                    # macOS/Linux
dir                       # Windows

# Should show:
01_Documents/             ✓ Documentation
02_Test_Plans_and_Reports/ ✓ Test results
03_Test_Scripts_and_Automation/ ✓ Tests
src/                      ✓ Source code
public/                   ✓ Static assets
node_modules/             ✓ Dependencies
package.json              ✓ Config
vite.config.ts            ✓ Vite config
tsconfig.json             ✓ TypeScript config
```

### Verify Key Files

```bash
# Check TypeScript compilation
npx tsc --noEmit

# Check ESLint (should show no errors)
npm run lint

# Check all tests
npm run test:unit
```

---

## FIRST TIME SETUP

### 1. Initial Data Loading

When app first starts:
```
Browser loads
  ↓
seedStore data loaded from mockBackend.ts
  ↓
IndexedDB initialized with seed data
  ↓
App ready (can see login screen)
```

### 2. Trying the Application

**Step 1: Login**
```
URL: http://localhost:8080
Click "Login"
Enter: admin@sekolah.test / password123
Submit
→ Redirects to dashboard
```

**Step 2: Explore Features**
```
Dashboard view → Shows statistics
Module tabs → Jurnal / BK / Kesiswaan / Users
Create → Add new entry
Edit → Modify existing
Delete → Remove entry
```

**Step 3: Try Different Roles**
```
Logout → Click logout button
Login as guru@sekolah.test → See only Jurnal
Login as bk@sekolah.test → See BK + Kesiswaan
Login as wali@sekolah.test → See limited Kesiswaan
```

### 3. Check Browser Storage

**IndexedDB Data:**
```
DevTools → Application → IndexedDB → sis-terpadu-db
├─ users store
├─ journalEntries store
├─ bkCases store
├─ students store
└─ activityLogs store
```

**localStorage Session:**
```
DevTools → Application → Local Storage
├─ sis-terpadu-session-v1 (current user)
└─ sis-terpadu-store-v1 (backup)
```

### 4. Enable DevTools in Browser

**Chrome/Edge:**
```
F12 → DevTools opens
→ Application tab → See storage
→ Console → Debug messages
→ Network → See requests
```

**Firefox:**
```
F12 → DevTools opens
→ Storage tab → See storage
→ Console → Debug messages
→ Network → See requests
```

---

## COMMON ISSUES & SOLUTIONS

### Issue 1: npm install fails

**Error:** `npm ERR! code ERESOLVE`

**Solution:**
```bash
# Use --legacy-peer-deps flag
npm install --legacy-peer-deps

# Or upgrade npm
npm install -g npm@latest
npm install
```

---

### Issue 2: Node version mismatch

**Error:** `Error: Node.js 18+ is required`

**Solution:**
```bash
# Check current version
node --version

# If < 18, upgrade Node.js
# https://nodejs.org (download LTS)

# Verify upgrade
node --version  # Should show >= 18
```

---

### Issue 3: Port 8080 already in use

**Error:** `EADDRINUSE: address already in use :::8080`

**Solution:**
```bash
# Option 1: Use different port
npm run dev -- --port 3000
# Then access: http://localhost:3000

# Option 2: Kill process using port 8080
# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :8080
kill -9 <PID>
```

---

### Issue 4: Module not found errors

**Error:** `Cannot find module '@radix-ui/react-dialog'`

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Or just install specific package
npm install --save @radix-ui/react-dialog
```

---

### Issue 5: TypeScript errors

**Error:** `Type 'string' is not assignable to type 'number'`

**Solution:**
```bash
# Restart TypeScript server
# In VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"

# Or manually fix type issues
# Check tsconfig.json and make sure types are correct
```

---

### Issue 6: Hot reload not working

**Symptom:** Changes to code don't reflect in browser

**Solution:**
```bash
# Stop dev server (Ctrl+C)
# Clear browser cache
# Delete .vite folder (if exists)
rm -rf .vite
# Restart dev server
npm run dev

# Or:
# Ctrl+Shift+R (hard refresh browser)
```

---

### Issue 7: IndexedDB errors

**Error:** `QuotaExceededError: DOM Exception 22`

**Solution:**
```bash
# Clear browser storage
DevTools → Application → IndexedDB
Right-click sis-terpadu-db → Delete
Refresh page
→ App will recreate database with seed data

# Or programmatically:
localStorage.clear()
indexedDB.deleteDatabase('sis-terpadu-db')
```

---

### Issue 8: Component not rendering

**Symptom:** UI partially visible or broken

**Solution:**
```bash
# Check console for errors
DevTools → Console tab → Look for red errors

# Verify Tailwind CSS is loaded
DevTools → Network tab → Check for .css files

# Clear cache
DevTools → Settings → Network → Disable cache
Refresh page (Ctrl+R)

# Or restart dev server
npm run dev
```

---

## BUILDING FOR PRODUCTION

### Create Production Build

```bash
# Build optimized version
npm run build

# Output in dist/ folder (~1-2 MB)
```

**Build Process:**
```
TypeScript Compilation
  ↓
React optimization
  ↓
Tailwind CSS purging
  ↓
Code minification & bundling
  ↓
Output: dist/ folder ready for deployment
```

### Preview Production Build Locally

```bash
# Build first
npm run build

# Preview the production build
npm run preview

# Opens at http://localhost:4173
```

### Deployment Checklist

Before deploying:
- [ ] All tests pass (`npm run test:unit`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Build completes without errors (`npm run build`)
- [ ] Preview works locally (`npm run preview`)
- [ ] Code review completed
- [ ] Security audit done
- [ ] Performance optimized
- [ ] Cross-browser tested

### Deploy to Hosting

**Option 1: Netlify (Recommended for beginners)**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir dist

# Get URL after deployment
```

**Option 2: Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Follow prompts
```

**Option 3: GitHub Pages**
```bash
# Edit vite.config.ts
# Add base: '/web-jurnal-mengajar/'

# Build
npm run build

# Push dist/ to gh-pages branch
# Enable GitHub Pages in settings
```

---

## DEVELOPMENT WORKFLOW

### Recommended Workflow

```
1. Start dev server
   npm run dev

2. Open VS Code
   code .

3. Open Chrome DevTools
   F12

4. Edit file in VS Code
   src/routes/index.tsx

5. See changes in browser instantly
   (Hot reload)

6. Check console for errors
   DevTools → Console

7. Test in browser
   Click buttons, submit forms

8. Repeat steps 4-7 until done

9. Run tests before commit
   npm run test:unit

10. Build before production
    npm run build
```

### Code Quality Workflow

```bash
# Before committing code:

# 1. Run tests
npm run test:unit

# 2. Check linting
npm run lint

# 3. Format code
npm run format

# 4. Type check
npx tsc --noEmit

# 5. Build check
npm run build

# Then commit if all pass ✓
git add .
git commit -m "Feature: Add new feature"
```

---

## DEBUGGING TIPS

### Use Browser DevTools

**Console:**
```javascript
// Add debug logs
console.log('Value:', variable);
console.warn('Warning message');
console.error('Error occurred');
console.table(arrayOfObjects);
```

**Breakpoints:**
```
DevTools → Sources tab
Click line number to set breakpoint
Refresh page to trigger
Step through code (F10 to step over, F11 to step into)
```

**Network Tab:**
```
DevTools → Network tab
See all browser storage operations
Check IndexedDB queries
Monitor performance
```

### VS Code Debugging

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:8080",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

Then press F5 to debug with breakpoints in VS Code.

---

## NEXT STEPS

After successful installation:

1. **Explore the code:**
   - Read `src/routes/index.tsx` (main app)
   - Check `src/lib/mockBackend.ts` (data logic)
   - Review `src/components/ui/` (UI components)

2. **Read documentation:**
   - `DOKUMENTASI_TEKNIS.md` (Technical deep dive)
   - `01_Documents/SRS.md` (Requirements)
   - `01_Documents/SDD.md` (Design)

3. **Run tests:**
   - `npm run test:unit` (Unit tests)
   - `npm run test:e2e:open` (E2E tests)

4. **Make changes:**
   - Create new feature
   - Modify existing components
   - Add test cases

5. **Deploy:**
   - `npm run build` (Production build)
   - Deploy to hosting service
   - Share live link

---

**Installation complete! Happy coding! 🚀**

For more help:
- Check GitHub Issues: https://github.com/Izhar2005/web-jurnal-mengajar/issues
- Read Node.js docs: https://nodejs.org/docs
- Vite docs: https://vitejs.dev
- React docs: https://react.dev
