# Setting Up Stack GitHub Repository

This guide will help you push only the code and README to GitHub, excluding all documentation files.

## What Will Be Included

✅ **Included in Repository:**
- All source code (`/src` directory)
- Configuration files (`package.json`, `tsconfig.json`, `tailwind.config.ts`, etc.)
- `README.md` (the main project readme)
- `.gitignore` (to maintain exclusions)
- `next.config.js`, `postcss.config.js`

❌ **Excluded from Repository:**
- All documentation guides (`*_GUIDE.md`, `*_COMPLETE.md`, `INTEGRATION_STATUS.md`, etc.)
- `node_modules/` directory
- Build artifacts (`.next/`, `/out/`, `/build/`)
- Environment files (`.env*.local`)
- TypeScript build info

## Step-by-Step Setup

### 1. Initialize Git Repository

```bash
cd "/Users/thys/Projects/Simple Wellness App/Stack-Web"
git init
```

### 2. Review What Will Be Committed

Check which files will be tracked:

```bash
git status
```

You should see:
- ✅ `README.md` (included)
- ❌ Documentation files like `SETUP_COMPLETE.md`, `*_GUIDE.md` (excluded by .gitignore)

### 3. Add All Files

```bash
git add .
```

### 4. Create Initial Commit

```bash
git commit -m "Initial commit: Stack wellness tracking app"
```

### 5. Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click the **+** button in the top-right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name:** `stack-app` (or your preferred name)
   - **Description:** "A modern wellness tracking app for building daily habits and achieving goals"
   - **Visibility:** Public or Private (your choice)
   - **Do NOT** initialize with README (we already have one)
5. Click **"Create repository"**

### 6. Link Local Repo to GitHub

GitHub will show you commands after creating the repo. Use these:

```bash
# Replace USERNAME and REPO_NAME with your actual values
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/johndoe/stack-app.git
git branch -M main
git push -u origin main
```

### 7. Verify on GitHub

Visit your repository URL (e.g., `https://github.com/USERNAME/REPO_NAME`) and verify:
- ✅ All code files are present
- ✅ `README.md` is displayed
- ❌ No documentation guides are visible

---

## Future Updates

### To Push New Changes:

```bash
# Stage all changes
git add .

# Commit with a message
git commit -m "Description of changes"

# Push to GitHub
git push
```

### To Add Documentation Later:

If you ever want to include specific documentation:

1. Remove it from `.gitignore`:
   ```bash
   # Edit .gitignore and remove the line for that file
   ```

2. Add and commit:
   ```bash
   git add SPECIFIC_FILE.md
   git commit -m "Add documentation for X"
   git push
   ```

---

## Current .gitignore Configuration

Your `.gitignore` now includes:

```
# Documentation (keep only README.md)
*_GUIDE.md
*_COMPLETE.md
INTEGRATION_STATUS.md
RETROACTIVE_ACTIVITY_GUIDE.md
CROSS_TAB_INTEGRATION_GUIDE.md
```

This pattern will:
- ✅ Include `README.md` (no match)
- ❌ Exclude `SETUP_COMPLETE.md` (matches `*_COMPLETE.md`)
- ❌ Exclude `CALENDAR_NAVIGATION_GUIDE.md` (matches `*_GUIDE.md`)
- ❌ Exclude `DATA_INPUT_GUIDE.md` (matches `*_GUIDE.md`)
- ❌ Exclude all other documentation guides

---

## Troubleshooting

### If Documentation Files Appear in `git status`:

1. Make sure `.gitignore` has been saved with the new rules
2. If files were already tracked, remove them from Git cache:
   ```bash
   git rm --cached SETUP_COMPLETE.md
   git rm --cached *_GUIDE.md
   git rm --cached INTEGRATION_STATUS.md
   git commit -m "Remove documentation from tracking"
   ```

### If You Accidentally Committed Documentation:

```bash
# Remove specific files from Git tracking
git rm --cached UNWANTED_FILE.md

# Commit the removal
git commit -m "Remove documentation from repository"

# Push the changes
git push
```

---

## Quick Reference Commands

```bash
# Check status
git status

# Stage all changes
git add .

# Commit changes
git commit -m "Your message here"

# Push to GitHub
git push

# Pull latest changes
git pull

# View commit history
git log --oneline

# See what's ignored
git status --ignored
```

---

## Repository Description Ideas

Use one of these for your GitHub repository description:

- "A modern wellness tracking app for building daily habits and achieving goals"
- "Track your physical and mental wellness with Stack - a beautiful habit tracking app"
- "Stack: Build your perfect day, one habit at a time"
- "Comprehensive wellness tracking with goals, habits, journal, and insights"

---

## Tags/Topics for Repository

Add these topics to make your repo discoverable:

- `wellness`
- `habit-tracker`
- `nextjs`
- `react`
- `typescript`
- `tailwindcss`
- `productivity`
- `health`
- `fitness`
- `journal`
- `goals`
- `habits`

---

## License Recommendation

Consider adding a license file:

```bash
# For open source, MIT License is popular:
echo "MIT License

Copyright (c) $(date +%Y) [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy..." > LICENSE
```

Or choose a license at [choosealicense.com](https://choosealicense.com/)

---

## Ready to Push!

Your Stack app is now ready to be shared on GitHub with just the code and README! 🚀

