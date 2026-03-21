# Snippet Studio

A modern code snippet manager that allows developers to create, save, organize, and share code snippets with features like syntax highlighting, public/private visibility, screenshot export, and AI-powered enhancements, backed by a freemium subscription model.

[![Vercel Deploy](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://snippet-studio-lovat.vercel.app/)
[![Convex](https://img.shields.io/badge/Backend-Convex-blue)](https://convex.dev/)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-purple?logo=stripe)](https://stripe.com/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-orange)](https://clerk.com/)
[![Anthropic Claude](https://img.shields.io/badge/AI-Anthropic%20Claude-orange?logo=anthropic)](https://www.anthropic.com/)

🚀 **Live Demo:** [snippet-studio-lovat.vercel.app](https://snippet-studio-lovat.vercel.app/)

---

## Overview

Snippet Studio is a full-stack TypeScript application built with Next.js 15 that helps developers manage their code snippets effectively. The platform combines a rich code editor with real-time database synchronization, authentication, payment processing, and AI-powered features to provide a comprehensive snippet management solution.

**Key Highlights:**
- Built with Next.js 15 App Router and React 19
- Real-time backend powered by Convex
- Secure authentication via Clerk
- Freemium model with Stripe subscriptions (30 free snippets, unlimited for Pro)
- AI features using Anthropic's Claude API
- Responsive design with dark/light theme support

---

## Features

### Core Snippet Management
- **Create and Edit Snippets**: Full-featured code editor with CodeMirror integration
- **Syntax Highlighting**: Support for 28+ programming languages via Highlight.js
- **Tag System**: Organize snippets with custom tags and filter by tag or language
- **Real-time Search**: Instantly search snippets by title, language, or tags
- **Public/Private Visibility**: Toggle between public and private snippet sharing

### Sharing and Export
- **One-Click Sharing**: Generate shareable links for public snippets
- **Screenshot Export**: Export beautiful code screenshots with:
  - 8 customizable gradient backgrounds
  - macOS-style window chrome
  - PNG download or clipboard copy
  - Language badges and tag display
- **Social Sharing**: Direct sharing to X (Twitter), LinkedIn, Reddit, WhatsApp, and Telegram
- **Native Share API**: Mobile-optimized sharing experience

### AI-Powered Features
- **Code Explanation**: Get AI-generated explanations of your code
- **Tag Suggestions**: Automatic tag recommendations based on code content
- **Title Generation**: AI-powered snippet title suggestions

### User Experience
- **Theme Support**: Dark and light mode with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Usage Tracking**: Visual progress bars showing snippet quota usage
- **Statistics Dashboard**: View total, public, and private snippet counts

### Premium Features (Pro Plan)
- Unlimited snippets (vs. 30 for free)
- Private snippet support
- Screenshot export functionality
- Full access to AI features
- Priority support

---

## Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router and Turbopack
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4 with custom theme
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Code Editor**: CodeMirror 6 with language extensions
- **Syntax Highlighting**: Highlight.js
- **Theme Management**: next-themes
- **Forms**: React Hook Form with Zod validation

### Backend
- **Database & API**: Convex (serverless real-time backend)
- **Authentication**: Clerk with Next.js integration
- **Payments**: Stripe (subscription management)
- **AI Integration**: Anthropic AI SDK (Claude)

### Development Tools
- **Package Manager**: npm/yarn
- **Linting**: ESLint 9 with Next.js config
- **Deployment**: Vercel (frontend) + Convex (backend)
- **Concurrent Scripts**: npm-run-all

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 20 or higher
- **npm** or **yarn**: Latest version
- **Git**: For cloning the repository

You'll also need accounts for:
- [Clerk](https://clerk.com/) - Authentication
- [Convex](https://convex.dev/) - Backend database
- [Stripe](https://stripe.com/) - Payment processing
- [Anthropic](https://www.anthropic.com/) - AI features

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/hasnatamir2/snippet-studio.git
cd snippet-studio
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Convex

```bash
npx convex dev
```

This command will:
- Create a new Convex project (if you don't have one)
- Generate your `NEXT_PUBLIC_CONVEX_URL`
- Set up the local development environment

### 4. Configure External Services

#### Clerk Setup
1. Create a new application at [clerk.com](https://clerk.com/)
2. Copy your publishable and secret keys
3. Configure sign-in/sign-up pages in Clerk dashboard

#### Stripe Setup
1. Create a Stripe account at [stripe.com](https://stripe.com/)
2. Create a product with a monthly price (e.g., $9/month for Pro)
3. Copy your secret key, publishable key, and webhook secret
4. Set up webhook endpoint: `https://yourdomain.com/api/stripe/webhook`

#### Anthropic Setup
1. Sign up at [anthropic.com](https://www.anthropic.com/)
2. Generate an API key from your dashboard

---

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY=price_xxxxxxxxxxxxx

# Anthropic AI
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_CONVEX_URL` | Your Convex deployment URL | `https://xxx.convex.cloud` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | `pk_test_xxx` |
| `CLERK_SECRET_KEY` | Clerk secret key | `sk_test_xxx` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_xxx` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | `pk_test_xxx` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | `whsec_xxx` |
| `NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY` | Stripe price ID for Pro plan | `price_xxx` |
| `ANTHROPIC_API_KEY` | Anthropic API key | `sk-ant-xxx` |
| `NEXT_PUBLIC_APP_URL` | Your app's URL | `http://localhost:3000` |

---

## Running the Application

### Development Mode

#### Run Everything (Recommended)
```bash
npm run dev
```

This command runs both frontend and backend concurrently:
- Frontend: `http://localhost:3000`
- Convex dev server: automatically started

#### Run Frontend Only
```bash
npm run dev:frontend
```

#### Run Backend Only
```bash
npm run dev:backend
```

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy Convex to production:

```bash
npx convex deploy
```

Update your `NEXT_PUBLIC_CONVEX_URL` in Vercel to the production URL.

---

## Project Structure

```
snippet-studio/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API routes
│   │   │   ├── snippet-meta/     # OG image metadata
│   │   │   └── stripe/           # Stripe webhooks & handlers
│   │   ├── billing/              # Billing and payment pages
│   │   │   └── payment/          # Checkout page
│   │   ├── dashboard/            # User dashboard
│   │   ├── new/                  # Create snippet page
│   │   ├── sign-in/              # Clerk sign-in
│   │   ├── sign-up/              # Clerk sign-up
│   │   ├── snippets/             # Snippet viewer
│   │   │   └── [snippetId]/      # Dynamic snippet route
│   │   ├── globals.css           # Global styles
│   │   ├── icon.svg              # App icon
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Landing page
│   ├── components/               # React components
│   │   ├── app-sidebar/          # Sidebar navigation
│   │   ├── code-block/           # Code display components
│   │   │   ├── code-block.tsx    # Static code display
│   │   │   └── code-input.tsx    # CodeMirror editor
│   │   ├── convex/               # Convex React providers
│   │   ├── landing/              # Landing page components
│   │   ├── snippets/             # Snippet-related components
│   │   │   ├── snippet-card.tsx  # Snippet list card
│   │   │   ├── snippet-explanation.tsx
│   │   │   ├── snippet-form.tsx  # Create/edit form
│   │   │   ├── snippet-screenshot.tsx
│   │   │   ├── snippet-usage-tracker.tsx
│   │   │   ├── snippets-list.tsx
│   │   │   ├── share-panel.tsx
│   │   │   └── tag-input.tsx
│   │   ├── stripe/               # Stripe components
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── clerk-provider.tsx
│   │   ├── error-boundary.tsx
│   │   ├── header.tsx
│   │   └── theme-provider.tsx
│   ├── hooks/                    # Custom React hooks
│   │   └── use-mobile.ts
│   ├── lib/                      # Utility functions
│   │   ├── constant.ts           # App constants
│   │   └── utils.ts              # Helper functions
│   └── middleware.ts             # Clerk middleware
├── convex/                       # Convex backend
│   ├── _generated/               # Auto-generated types
│   ├── actions/                  # Convex actions
│   │   ├── ai.ts                 # AI features
│   │   └── stripe.ts             # Stripe integration
│   ├── http.ts                   # HTTP endpoints
│   ├── mutations/                # Database mutations
│   │   ├── snippet.ts
│   │   └── users.ts
│   ├── queries/                  # Database queries
│   │   ├── snippets.ts
│   │   └── user.ts
│   ├── schema.ts                 # Database schema
│   └── tsconfig.json
├── public/                       # Static assets
├── .eslintrc.json               # ESLint config
├── package.json                 # Dependencies
├── tailwind.config.ts           # Tailwind config
├── tsconfig.json                # TypeScript config
└── README.md                    # This file
```

### Key Directories

- **`src/app/`**: Next.js 15 App Router pages and layouts
- **`src/components/`**: Reusable React components organized by feature
- **`convex/`**: Backend logic, database schema, and serverless functions
- **`src/lib/`**: Shared utilities and constants

---

## Usage Guide

### Creating Your First Snippet

1. **Sign Up/Sign In**
   - Visit the homepage and click "Sign up"
   - Complete Clerk authentication flow

2. **Create a Snippet**
   - Click "New snippet" in the header
   - Enter your code in the editor
   - The language is auto-detected, or manually select from 28+ options
   - Add a title (or use AI to generate one)
   - Add tags for organization
   - Toggle public/private visibility
   - Click "Save Snippet" or press `Cmd+S` / `Ctrl+S`

### Managing Snippets

#### Dashboard View
Navigate to `/dashboard` to see all your snippets with:
- **Stats Cards**: Total, public, private snippet counts, and plan status
- **Search Bar**: Real-time search by title, language, or tag
- **Language Filters**: Quick filter pills for each language
- **Snippet Cards**: Grid view with actions

#### Snippet Card Actions
- **Edit**: Click pencil icon to modify
- **Copy Code**: Click copy icon to copy code to clipboard
- **Delete**: Click trash icon (requires confirmation)
- **Toggle Visibility**: Lock/unlock icon to change public/private status
- **Share**: Share icon (only visible for public snippets)

### Code Editor Features

The CodeMirror-based editor includes:

- **Theme Toggle**: Switch between light and dark modes
- **Font Size Control**: Choose SM (13px), MD (15px), or LG (17px)
- **Line Numbers**: Toggle line number visibility
- **Keyboard Shortcut**: Save with `Cmd+S` or `Ctrl+S`
- **Language Support**: Auto-detection with manual override

### Screenshot Export

1. Click "Screenshot" on any snippet
2. Select a gradient background (8 options available)
3. Export options:
   - **Download PNG**: Save to your device
   - **Copy Image**: Copy to clipboard
   - **Share**: Use native sharing (mobile) or social platforms

The screenshot includes:
- macOS-style window chrome
- Language badge
- Snippet tags (if present)
- Custom gradient background

### AI Features

#### Code Explanation
1. Open any snippet
2. Click "Explain" in the toolbar
3. AI generates a detailed explanation of your code

#### Tag Suggestions
- After saving a snippet, AI automatically suggests relevant tags
- Click on suggested tags to add them to your snippet

#### Title Generation
1. Write your code
2. Click the sparkle icon next to the title field
3. AI generates a descriptive title

### Sharing Snippets

#### Public Snippets
1. Toggle snippet to public
2. Click "Share" button
3. Copy link or share directly to:
   - X (Twitter)
   - LinkedIn
   - Reddit
   - WhatsApp
   - Telegram

#### Private Snippets
- Only visible to the owner
- Share button is disabled
- Cannot be accessed via direct URL by others

### Search and Filter

**Search Bar**:
```
Type: "react hooks" 
Matches: Titles, languages, and tags containing "react" or "hooks"
```

**Language Filters**:
- Click "All" to view all snippets
- Click any language pill to filter by that language
- Active filters are highlighted

**Combined Search**:
- Use search bar and language filter together
- Results update in real-time

---

## Subscription Plans

### Free Plan

**Price**: $0/month

**Features**:
- 30 snippets maximum
- Public snippet sharing
- Syntax highlighting for 28+ languages
- Tags and search
- Real-time sync

**Limitations**:
- No private snippets
- No screenshot export
- No AI features
- No priority support

### Pro Plan

**Price**: $9/month

**Features
