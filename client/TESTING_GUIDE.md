# Testing Guide for UI Redesign

## Quick Start Testing

### 1. Start the Application
```bash
# If not already running:
cd /Users/tassel/Documents/Project/Cohere
npm run dev
```

The app should be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### 2. Test Theme Toggle
1. Open http://localhost:3000
2. Look for the 🌙 (moon) icon in the navbar
3. Click it to switch to dark mode
4. Verify:
   - Background changes to dark (#0F172A)
   - Text becomes light (#F1F5F9)
   - Smooth 300ms transition
   - Icon changes to ☀️ (sun)
5. Refresh the page - theme should persist
6. Open in a new tab - theme should match

### 3. Test Sidebar Navigation
**Desktop (> 1024px):**
1. Sidebar should be visible on the left
2. Shows icons + text labels
3. Click navigation items:
   - 🏠 Home
   - 🏷️ Tags
   - ✍️ Ask Question (if logged in)
   - 👤 Profile (if logged in)
4. Active route should be highlighted in orange
5. Click collapse button (◀) to collapse sidebar
6. Sidebar should show icons only

**Tablet (768px - 1024px):**
1. Resize browser to tablet width
2. Sidebar should auto-collapse to icons only

**Mobile (< 768px):**
1. Resize browser to mobile width
2. Sidebar should be hidden
3. Look for floating hamburger button (bottom-right)
4. Click hamburger to open sidebar overlay
5. Click outside sidebar to close
6. Click navigation item - sidebar should close

### 4. Test Festival Banner
**Current Date: February 14, 2026**
1. Open the app
2. You should see the Lunar New Year banner:
   - 🎊 emoji
   - "Happy Lunar New Year!"
   - Red-orange-yellow gradient background
3. Click the X button to dismiss
4. Refresh page - banner should stay dismissed

### 5. Test Dark Theme Across Pages
Visit each page in dark mode and verify readability:
- Home page (/)
- Question detail (/questions/:id)
- Ask question (/ask)
- Tags page (/tags)
- Profile page (/profile/:id)
- Login page (/login)
- Register page (/register)

Check:
- Text is readable (good contrast)
- Cards have visible borders
- Buttons have clear hover states
- Forms are usable
- Rich text editor is readable

### 6. Test Animations
**Theme Toggle:**
- Button scales on hover (1.1x)
- Button scales on tap (0.9x)
- Icon rotates 15° on hover

**Sidebar:**
- Smooth expand/collapse animation
- Navigation items fade in/out
- Active state transitions smoothly

**Festival Banner:**
- Slides down on mount
- Fades in (opacity 0 → 1)
- Slides up on dismiss

**Existing Animations:**
- Question cards stagger on load
- Vote buttons scale on interaction
- Card hover effects (translateY -4px)

## Developer Tools

### View Current Theme
```javascript
document.documentElement.classList.contains('dark')
```

### Clear Festival Banner
```javascript
localStorage.removeItem('dismissed-festival-lunar-new-year-2026')
location.reload()
```

### Clear All Theme Data
```javascript
localStorage.removeItem('theme')
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('dismissed-festival-')) {
    localStorage.removeItem(key)
  }
})
location.reload()
```

## Success Criteria

✅ All tests pass
✅ No console errors
✅ Smooth animations (60fps)
✅ Theme persists across sessions
✅ Sidebar works on all screen sizes
✅ Festival banner shows/hides correctly
✅ All existing features work
✅ Good contrast in both themes
✅ Fast performance (< 100ms interactions)
