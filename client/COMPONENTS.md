# Cohere UI Components Library

A comprehensive collection of reusable React components built with Framer Motion, Tailwind CSS, and a consistent design system.

## 📦 Component Categories

### Layout Components
- **Footer** - Comprehensive footer with social links and navigation
- **MobileMenu** - Responsive mobile navigation with slide-in animation
- **Sidebar** - Collapsible sidebar with navigation items

### Display Components
- **QuestionCard** - Question preview card with stats and tags
- **AnswerCard** - Answer display with voting and acceptance
- **QuestionStats** - Question statistics widget
- **TopContributors** - Weekly top contributors showcase
- **PopularTags** - Popular tags widget
- **CommunityStats** - Community statistics grid
- **HelpfulTips** - Helpful tips widget
- **AskQuestionWidget** - Call-to-action widget
- **RelatedQuestions** - Related questions list
- **TagList** - Tag list with counts

### Interactive Components
- **VoteButtons** - Upvote/downvote buttons with animations
- **BookmarkButton** - Bookmark toggle button
- **CommentList** - Comment list with sorting
- **Comment** - Individual comment with voting
- **RichTextEditor** - Tiptap-based WYSIWYG editor

### Overlay Components
- **Modal** - Modal dialog with multiple sizes
- **Drawer** - Slide-in drawer (4 positions)
- **Dropdown** - Dropdown menu with alignment options
- **Tabs** - Tabbed interface with animated indicator
- **Accordion** - Expandable accordion
- **Toast** - Toast notifications (4 types)

### UI Components
- **Tooltip** - Tooltip with 4 positions
- **Badge** - Badge with variants and sizes
- **Divider** - Divider with optional text
- **ProgressBar** - Animated progress bar
- **Avatar** - Avatar with status indicator
- **AvatarGroup** - Avatar group with overflow
- **Chip** - Chip with delete functionality

### Utility Components
- **ScrollToTop** - Scroll to top button
- **BackButton** - Back navigation button
- **ShareButton** - Share with native API
- **CopyButton** - Copy to clipboard
- **LikeButton** - Like button with animation

### Loading & Error States
- **LoadingSpinner** - Spinner with sizes
- **LoadingDots** - Animated dots
- **LoadingBar** - Progress bar
- **LoadingOverlay** - Full-screen overlay
- **PulseLoader** - Pulse animation
- **SkeletonCard** - Card skeleton
- **SkeletonSidebar** - Sidebar skeleton
- **SkeletonList** - List skeleton
- **SkeletonProfile** - Profile skeleton
- **ErrorBoundary** - Error boundary wrapper
- **EmptyState** - Empty state display
- **ErrorMessage** - Error message display
- **SuccessMessage** - Success message
- **InfoMessage** - Info message

### Advanced Components
- **AdvancedSearch** - Advanced search with filters
- **UserSettings** - User settings panel (5 tabs)
- **NotificationCenter** - Notification panel
- **NotificationBadge** - Notification badge

### Data Visualization
- **ActivityChart** - Line chart for activity
- **ReputationChart** - Bar chart for reputation
- **TagDistribution** - Doughnut chart for tags
- **SkillRadar** - Radar chart for skills
- **StatCard** - Stat card with change indicator

## 🎨 Design System

### Colors
```css
--color-primary: #6366F1 (Indigo)
--color-secondary: #EC4899 (Pink)
--color-accent: #F59E0B (Amber)
--color-success: #10B981 (Green)
--color-warning: #F59E0B (Amber)
--color-error: #EF4444 (Red)
```

### Spacing (8px grid)
```css
--space-1: 0.5rem (8px)
--space-2: 1rem (16px)
--space-3: 1.5rem (24px)
--space-4: 2rem (32px)
--space-5: 2.5rem (40px)
--space-6: 3rem (48px)
```

### Border Radius
```css
--radius-sm: 0.375rem (6px)
--radius-md: 0.5rem (8px)
--radius-lg: 0.75rem (12px)
--radius-xl: 1rem (16px)
--radius-full: 9999px
```

### Shadows
```css
--shadow-1: 0 1px 2px var(--shadow-sm)
--shadow-2: 0 2px 8px var(--shadow-sm)
--shadow-3: 0 8px 16px var(--shadow-md)
--shadow-4: 0 16px 32px var(--shadow-lg)
--shadow-5: 0 24px 48px var(--shadow-xl)
```

### Transitions
```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1)
```

## 🚀 Usage Examples

### Basic Card
```jsx
<div className="card">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>
```

### Tag
```jsx
<Link to="/tags/javascript" className="tag">
  javascript
</Link>
```

### Button
```jsx
<button className="btn-primary">
  Primary Button
</button>

<button className="btn-secondary">
  Secondary Button
</button>
```

### Modal
```jsx
import { Modal } from './components/Overlays';

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Modal Title"
  size="md"
>
  <p>Modal content</p>
</Modal>
```

### Loading States
```jsx
import { LoadingSpinner, SkeletonCard } from './components';

// Spinner
<LoadingSpinner size="lg" text="Loading..." />

// Skeleton
<SkeletonCard />
```

### Notifications
```jsx
import { NotificationCenter, NotificationBadge } from './components/NotificationCenter';

<NotificationBadge count={5} onClick={handleOpen} />
<NotificationCenter isOpen={isOpen} onClose={handleClose} />
```

## 📱 Responsive Design

All components are fully responsive and follow mobile-first design principles:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎭 Animations

All interactive components use Framer Motion for smooth animations:

- Hover effects with scale and translateY
- Slide-in animations for modals and drawers
- Fade-in animations for content
- Stagger animations for lists

## 🌙 Dark Mode

All components support dark mode through CSS variables:

```jsx
// Toggle dark mode
document.documentElement.classList.toggle('dark');
```

## 📊 Component Statistics

- **Total Components**: 60+
- **Layout Components**: 3
- **Display Components**: 11
- **Interactive Components**: 5
- **Overlay Components**: 6
- **UI Components**: 7
- **Utility Components**: 5
- **Loading/Error Components**: 14
- **Advanced Components**: 4
- **Data Visualization**: 5

## 🔧 Dependencies

- React 18+
- Framer Motion
- Tailwind CSS
- Tiptap (Rich Text Editor)
- Chart.js (Data Visualization)
- React Router
- React Hot Toast

## 📝 Best Practices

1. **Always use CSS variables** for colors, spacing, and other design tokens
2. **Follow the 8px grid system** for consistent spacing
3. **Use Framer Motion** for all animations
4. **Implement proper loading states** with skeletons
5. **Handle errors gracefully** with error boundaries
6. **Make components accessible** with proper ARIA labels
7. **Test on multiple devices** for responsive design
8. **Use semantic HTML** for better SEO and accessibility

## 🎯 Future Enhancements

- [ ] Add more chart types
- [ ] Implement virtual scrolling for long lists
- [ ] Add keyboard shortcuts
- [ ] Improve accessibility (WCAG 2.1 AA)
- [ ] Add component tests
- [ ] Create Storybook documentation
- [ ] Add internationalization (i18n)
- [ ] Implement PWA features

## 📄 License

MIT License - See LICENSE file for details

## 👥 Contributors

- Claude Sonnet 4.5 (AI Assistant)
- Your Team

---

Built with ❤️ using React, Framer Motion, and Tailwind CSS
