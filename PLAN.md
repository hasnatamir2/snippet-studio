# Snippet Studio — MicroSaaS Upgrade Plan

## Stack (existing)
- Next.js 15 App Router · TypeScript · Convex · Clerk · Stripe · Tailwind · shadcn/ui · CodeMirror · Highlight.js

---

## Phase 1 — Foundation Polish (Week 1–2)
> Goal: Fix what's broken. Ship a product people want to share.

### 1.1 Landing Page (Day 1–2)
- Replace empty homepage with full marketing page
- Hero: headline + subheadline + CTA + live demo snippet preview
- Features section (3–4 cards): syntax highlighting, public sharing, private, pro plan
- Pricing section: Free (30 snippets) / Pro ($5/mo unlimited) / Team ($12/seat)
- Footer with links

### 1.2 Snippet Free Tier (Day 1)
- Change limit from 9 → 30 snippets on free plan
- Enforce limit server-side in Convex mutation (not just client)
- Better upgrade prompt when hitting the wall

### 1.3 Onboarding (Day 2)
- Empty state on dashboard: "Create your first snippet" CTA
- First-login welcome modal with 3 steps
- Sample snippet auto-created on signup

### 1.4 Editor UX Improvements (Day 2–3)
- Add language selector dropdown (20+ languages)
- Auto-detect language from content
- Line numbers toggle
- Font size selector (sm/md/lg)
- Keyboard shortcut: Cmd+S to save
- Title auto-focus on new snippet

---

## Phase 2 — Core Feature Gaps (Week 2–4)
> Goal: Reach feature parity with competitors on the features that drive retention.

### 2.1 Tags + Search (Week 2)
**Convex schema changes:**
```
snippets: {
  ...existing,
  tags: v.array(v.string()),
  language: v.string(),
  description: v.optional(v.string()),
}
```
- Tag input component (multi-select with autocomplete from user's existing tags)
- Search bar on dashboard: searches title + tags + language
- Filter by language pill buttons
- Convex full-text search index on title + tags

### 2.2 Collections / Folders (Week 2–3)
**New Convex table:**
```
collections: {
  userId: v.id("users"),
  name: v.string(),
  icon: v.optional(v.string()),
  createdAt: v.number(),
}
```
- Sidebar: list of user collections + uncategorized
- Drag snippet into collection
- Collection badge on snippet card

### 2.3 Code Screenshot Export (Week 3) ← HIGH VALUE
- Use `html-to-image` or `dom-to-image-more` library
- Themed screenshot: window chrome (macOS/Windows/None style), gradient backgrounds (10+ presets)
- Export as PNG / Copy to clipboard
- Social sharing card format (1200×630 for Twitter/LinkedIn)
- This is a viral feature — people share these screenshots everywhere

### 2.4 Improved Snippet Card UI (Week 3)
- Language icon/badge
- Copy button with toast feedback
- View count (public snippets)
- Share button → copies public URL
- "Open full editor" vs inline preview

---

## Phase 3 — AI Features (Week 4–6)
> Goal: Differentiate from CodeImage, compete with Pieces on AI but stay web-native.

### 3.1 AI Tag Suggestion
- On snippet save: call Claude API with snippet content
- Auto-suggest 3–5 tags (language, framework, concept)
- User accepts/dismisses suggestions
- Model: claude-haiku-4-5 (fast + cheap for this)

### 3.2 AI Code Explanation
- "Explain this snippet" button → sidebar drawer
- Returns: what it does, key concepts, potential improvements
- Cached in Convex to avoid repeat API calls

### 3.3 AI Code Improvement
- "Improve" button: refactor for readability
- "Convert language" button: JS → TS, Python → JS, etc.
- Show diff before applying

### 3.4 AI Title + Description Generator
- If user leaves title blank, auto-generate from code content
- One-click "generate description" in the editor

---

## Phase 4 — Growth & Monetization (Week 6–8)
> Goal: Build the loops that bring in users without paid ads.

### 4.1 Public Explore Page
- `/explore` route: public snippets feed
- Filter by language, trending, recent
- Search across all public snippets
- This is SEO + viral acquisition

### 4.2 Snippet Embedding
- Embeddable iframe: `<iframe src="snippet-studio.app/embed/{id}">`
- WordPress plugin (later)
- Notion-friendly via iframe paste
- OpenGraph meta tags on public snippet pages (rich previews)

### 4.3 Team Plan ($12/seat)
**New Convex tables:**
```
teams: { name, ownerId, plan, seats }
teamMemberships: { teamId, userId, role }
teamSnippets: { teamId, snippetId, addedBy }
```
- Invite by email
- Shared collections
- Team snippet library tab

### 4.4 Usage Analytics (Pro)
- View count on public snippets
- Weekly summary email: "Your top snippet got X views"
- Refer a friend → 1 month free

---

## Phase 5 — Integrations (Month 2–3)
> Goal: Get into developers' daily workflow.

### 5.1 VS Code Extension
- Search and insert snippets from command palette
- Save selection as snippet (right-click)
- Auth via token from dashboard

### 5.2 Browser Extension (Chrome)
- Select code on any webpage → save to Snippet Studio
- Quick-access popup with search

### 5.3 API
- REST API: CRUD snippets
- API key management in dashboard
- Rate limits by plan

---

## Immediate Claude Code Session — What to Build First

When you open Claude Code on this repo, give it these tasks in order:

### Session 1: Editor + Screenshot (highest visual impact)
```
Task: Improve the snippet editor and add code screenshot export.

1. Replace the current editor with an improved CodeMirror setup:
   - Add language selector (dropdown with 20+ common languages)
   - Add theme selector (dark/light/monokai/github/dracula)
   - Add line numbers toggle
   - Add font size control (14/16/18px)
   - Cmd+S / Ctrl+S to save

2. Add a "Screenshot" button to the snippet view:
   - Use html-to-image library
   - Render snippet in a styled window frame (macOS dots style)
   - 8 background gradient presets (dark, light, purple, ocean, sunset, forest, candy, noir)
   - Export as PNG
   - Copy image to clipboard option

3. Update the snippet card UI:
   - Language badge with color coding
   - Better copy button with animation
   - Show line count and character count
   - Tags display (even if empty for now)
```

### Session 2: Tags + Search
```
Task: Add tagging and search to snippets.

1. Update Convex schema (snippets table):
   - Add tags: v.array(v.string()) with default []
   - Add description: v.optional(v.string())
   - Ensure language field exists

2. Add tag input to snippet editor:
   - Multi-value input (enter to add, x to remove)
   - Shows existing tags as pills

3. Add search bar to dashboard:
   - Real-time filter by title, tags, language
   - Language filter pills (show only languages user has used)

4. Update snippet card to show tags
```

### Session 3: Landing Page
```
Task: Build a proper marketing landing page at app root (/).

Current: "/" just shows a near-empty page
Goal: Full marketing landing page

Sections:
1. Hero - "Your code snippets, beautifully organized & instantly shareable"
   - Two CTAs: "Start for free" (→ /dashboard) and "View demo snippets" (→ /explore)
   - Animated code snippet preview (use a real CodeMirror instance)

2. Features (3 columns):
   - Save & organize (syntax highlighting, tags, collections)
   - Share instantly (public/private, one-click link)
   - Look beautiful (screenshot export, themes)

3. Screenshot showcase - show the screenshot export feature visually

4. Pricing table:
   - Free: 30 snippets, public sharing
   - Pro ($5/mo): Unlimited, private, AI features, screenshot export
   - Team ($12/seat): Everything + shared collections

5. Footer

Design: Dark theme, consistent with existing shadcn/ui setup, clean developer aesthetic
```

---

## Pricing Change (Implement Immediately)

In the Convex mutation that checks snippet count, change:
```typescript
// Before
if (snippetCount >= 9) throw error

// After  
if (snippetCount >= 30) throw error
```

Update the Stripe product description and any UI copy from "9" to "30".

---

## Key Files to Know

```
src/app/                    # Next.js App Router pages
src/app/dashboard/          # Main dashboard
src/app/billing/            # Stripe billing
src/components/             # Shared components
convex/                     # Backend: schema, queries, mutations
convex/schema.ts            # Database schema — start here for new features
convex/snippets.ts          # Snippet CRUD — add tags/search here
```

---

## Definition of "Done" for V1 MicroSaaS Launch

- [ ] Landing page with pricing
- [ ] 30 snippet free tier
- [ ] Tags + search
- [ ] Collections (at least 1 level)
- [ ] Code screenshot export
- [ ] Improved editor (language selector, themes, keyboard shortcuts)
- [ ] Public explore page
- [ ] AI tag suggestion (basic)
- [ ] OpenGraph meta on public snippet pages
- [ ] Proper empty states + onboarding

That's a shippable, monetizable v1 that competes credibly against all three analyzed competitors.