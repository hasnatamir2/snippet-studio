# Snippet Studio API Reference

## Introduction

Snippet Studio is a code snippet management platform built on Next.js 15 and Convex. This API reference documents the backend functions, database operations, and integration points for authentication, payments, and AI features.

**Base Architecture:**
- **Backend**: Convex serverless functions (queries, mutations, actions)
- **Authentication**: Clerk with middleware protection
- **Payments**: Stripe subscriptions
- **AI**: Anthropic Claude via `@anthropic-ai/sdk`
- **Database**: Convex document storage

**Core Endpoints:**
- Convex functions are called via `useQuery`, `useMutation`, `useAction` hooks (client-side)
- HTTP API routes in `/src/app/api/` for Stripe webhooks and metadata
- All Convex functions are defined in `/convex/` directory

## Authentication

### Clerk Integration

Snippet Studio uses Clerk for authentication with the `@clerk/nextjs` package.

**Middleware Configuration** (`src/middleware.ts`):
```typescript
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

**Client-Side Components:**
```typescript
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

// Usage in header:
<SignedOut>
  <SignInButton>
    <Button variant='ghost' size='sm'>Sign in</Button>
  </SignInButton>
  <SignUpButton>
    <Button size='sm'>Sign up</Button>
  </SignUpButton>
</SignedOut>

<SignedIn>
  <UserButton />
</SignedIn>
```

**Server-Side Authentication:**
```typescript
import { currentUser } from "@clerk/nextjs/server";

// In a server component:
const user = await currentUser();
const userId = user?.id; // Clerk user ID
```

**Convex User Bootstrapper:**

The `ConvexUserBootstrapper` component ensures a user document exists in Convex when a user signs in:

```typescript
// src/components/convex/convex-user-bootstrapper.tsx
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function ConvexUserBootstrapper() {
  const { isSignedIn } = useAuth();
  const ensureUser = useMutation(api.mutations.users.ensureUser);

  useEffect(() => {
    if (isSignedIn) {
      ensureUser(); // Creates user doc if doesn't exist
    }
  }, [isSignedIn, ensureUser]);

  return null;
}
```

## Convex Functions Overview

Convex functions are organized into three types:

1. **Queries** (`convex/queries/`): Read-only operations
2. **Mutations** (`convex/mutations/`): Write operations
3. **Actions** (`convex/actions/`): External API calls (Stripe, AI)

**Function Access Patterns:**

```typescript
// Client-side usage:
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";

// Query (reactive, auto-updates):
const snippets = useQuery(api.queries.snippets.getSnippets, { clerkId: userId });

// Mutation (write to DB):
const createSnippet = useMutation(api.mutations.snippet.createSnippet);
await createSnippet({ title, content, language, isPublic, tags });

// Action (external calls):
const explainCode = useAction(api.actions.ai.explainCode);
const explanation = await explainCode({ snippetId, content, language });
```

**Server-Side Usage:**

```typescript
import { fetchQuery, fetchAction } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";

// In API routes or server components:
const snippet = await fetchQuery(api.queries.snippets.getSnippetById, { snippetId });
const result = await fetchAction(api.actions.stripe.createCheckout, { priceId, clerkId });
```

## Snippet Operations

### Data Model

**Snippet Schema:**
```typescript
interface ISnippet {
  _id: Id<"snippets">;
  _creationTime: number;
  userId: Id<"users">;
  title: string;
  content: string;
  language: string;
  isPublic: boolean;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}
```

**Supported Languages** (from `src/lib/constant.ts`):
```typescript
export const UniqueLangs = [
  "javascript", "python", "java", "cpp", "ruby", "go", "rust",
  "typescript", "csharp", "php", "swift", "kotlin", "scala",
  "haskell", "lua", "perl", "r", "dart", "elixir", "clojure",
  "erlang", "fsharp", "groovy", "julia", "matlab", "objectivec",
  "shell", "sql"
]; // 28 languages
```

### Create Snippet

**Mutation:** `api.mutations.snippet.createSnippet`

**Parameters:**
```typescript
{
  title: string;          // Min 2 chars (zod validation)
  content: string;        // Min 2 chars
  language: string;       // Min 2 chars
  isPublic: boolean;      // Visibility flag
  tags: string[];         // Array of tag strings
}
```

**Access Control:**
- Requires authenticated user (via Clerk)
- Free users: Max 30 snippets (enforced)
- Pro users: Unlimited

**Example:**
```typescript
const createSnippet = useMutation(api.mutations.snippet.createSnippet);

try {
  await createSnippet({
    title: "React useState Hook",
    content: "const [count, setCount] = useState(0);",
    language: "javascript",
    isPublic: true,
    tags: ["react", "hooks", "state"]
  });
  toast.success("Snippet saved!");
} catch (err) {
  if (err.message.includes("limit")) {
    toast.error("Free plan limit reached. Upgrade to Pro for unlimited snippets.");
  }
}
```

### Get Snippets

**Query:** `api.queries.snippets.getSnippets`

**Parameters:**
```typescript
{
  clerkId: string; // Clerk user ID
}
```

**Returns:** `ISnippet[]` (all snippets owned by user, ordered by `updatedAt` desc)

**Example:**
```typescript
const snippets = useQuery(api.queries.snippets.getSnippets, {
  clerkId: userId || ""
});

// Returns: [{ _id: "...", title: "...", content: "...", ... }, ...]
```

### Get Snippet by ID

**Query:** `api.queries.snippets.getSnippetById`

**Parameters:**
```typescript
{
  snippetId: Id<"snippets">;
}
```

**Access Control:**
- Public snippets: Anyone can view
- Private snippets: Only owner can access

**Returns:** `ISnippet | null`

**Example:**
```typescript
const snippet = useQuery(api.queries.snippets.getSnippetById, {
  snippetId: "kg2abc123..." as Id<"snippets">
});

if (!snippet) {
  return <div>Snippet not found or you don't have access.</div>;
}
```

### Update Snippet

**Mutation:** `api.mutations.snippet.updateSnippet`

**Parameters:**
```typescript
{
  snippetId: Id<"snippets">;
  userId: Id<"users">;      // For authorization
  title: string;
  content: string;
  language: string;
  isPublic: boolean;
  tags: string[];
}
```

**Example:**
```typescript
const updateSnippet = useMutation(api.mutations.snippet.updateSnippet);

await updateSnippet({
  snippetId: snippet._id,
  userId: snippet.userId,
  title: "Updated Title",
  content: snippet.content,
  language: snippet.language,
  isPublic: true,
  tags: ["updated", "tag"]
});
```

### Delete Snippet

**Mutation:** `api.mutations.snippet.deleteSnippet`

**Parameters:**
```typescript
{
  snippetId: Id<"snippets">;
  userId: Id<"users">; // Must match snippet owner
}
```

**Example:**
```typescript
const deleteSnippet = useMutation(api.mutations.snippet.deleteSnippet);

await deleteSnippet({
  snippetId: snip._id,
  userId: snip.userId
});
```

### Toggle Visibility

**Mutation:** `api.mutations.snippet.toggleSnippetVisibility`

**Parameters:**
```typescript
{
  snippetId: Id<"snippets">;
  userId: Id<"users">;
}
```

**Behavior:** Flips `isPublic` boolean

**Example:**
```typescript
const toggleSnippetVisibility = useMutation(
  api.mutations.snippet.toggleSnippetVisibility
);

await toggleSnippetVisibility({
  snippetId: snip._id,
  userId: snip.userId
});
toast.success("Snippet visibility updated!");
```

### Get Usage Stats

**Query:** `api.queries.snippets.getUsage`

**Parameters:**
```typescript
{
  clerkId: string;
}
```

**Returns:**
```typescript
{
  count: number;  // Total snippets owned
  limit: number;  // 30 for free, Infinity for pro
}
```

**Example:**
```typescript
const usage = useQuery(api.queries.snippets.getUsage, {
  clerkId: userId || ""
});

// usage.count = 15
// usage.limit = 30 (free) or Infinity (pro)
const percentage = (usage.count / usage.limit) * 100;
```

### Count Public/Private Snippets

**Queries:**
- `api.queries.snippets.getPublicSnippetCount`
- `api.queries.snippets.getPrivateSnippetCount`

**No Parameters Required** (uses authenticated user context)

**Example:**
```typescript
const publicCount = useQuery(api.queries.snippets.getPublicSnippetCount);
const privateCount = useQuery(api.queries.snippets.getPrivateSnippetCount);

// Returns: number (e.g., 10, 5)
```

## User Operations

### User Schema

```typescript
interface User {
  _id: Id<"users">;
  clerkId: string;           // Clerk user ID
  email: string;
  stripeCustomerId?: string; // Set when first subscription created
  subscriptionId?: string;   // Active subscription ID
  subscriptionTier: "free" | "pro";
  subscriptionStatus?: "active" | "canceled" | "incomplete";
}
```

### Ensure User Exists

**Mutation:** `api.mutations.users.ensureUser`

**No Parameters** (uses Clerk auth context)

**Behavior:**
- Called automatically on sign-in via `ConvexUserBootstrapper`
- Creates user document if doesn't exist
- Uses Clerk's `ctx.auth.getUserIdentity()`

**Example:**
```typescript
// Typically auto-called, but can be invoked manually:
const ensureUser = useMutation(api.mutations.users.ensureUser);
await ensureUser();
```

### Get User by Clerk ID

**Query:** `api.queries.user.getUserByClerkId`

**Parameters:**
```typescript
{
  clerkId: string;
}
```

**Returns:** User object or `null`

**Example:**
```typescript
const dbUser = useQuery(api.queries.user.getUserByClerkId, {
  clerkId: userId || ""
});

const isPro = dbUser?.subscriptionTier === "pro";
const isActive = dbUser?.subscriptionStatus === "active";
```

## AI Features

Snippet Studio uses **Anthropic Claude** (`claude-3-5-sonnet-20241022` model) for three AI features:

1. **Code Explanation**
2. **Tag Suggestions**
3. **Title Generation**

### Configuration

AI features require an API key set in Convex environment:

```bash
# In Convex dashboard or via CLI:
npx convex env set ANTHROPIC_API_KEY your_key_here
```

### Code Explanation

**Action:** `api.actions.ai.explainCode`

**Parameters:**
```typescript
{
  snippetId: Id<"snippets">;
  content: string;    // Code to explain
  language: string;   // Programming language
}
```

**Returns:** `string` (plain text explanation)

**Example:**
```typescript
const explainCode = useAction(api.actions.ai.explainCode);

const explanation = await explainCode({
  snippetId: snippet._id,
  content: "const add = (a, b) => a + b;",
  language: "javascript"
});

// Returns: "This code defines an arrow function named 'add' that takes two parameters..."
```

**UI Implementation:**
```typescript
// src/components/snippets/snippet-explanation.tsx
<Button variant='ghost' size='sm' onClick={handleExplain}>
  <Sparkles className='w-4 h-4 mr-1' /> Explain
</Button>

// Opens Sheet with explanation text
```

### Tag Suggestions

**Action:** `api.actions.ai.suggestTags`

**Parameters:**
```typescript
{
  content: string;   // Code snippet
  language: string;  // Programming language
}
```

**Returns:** `string[]` (array of 3-5 suggested tags)

**Example:**
```typescript
const suggestTagsAction = useAction(api.actions.ai.suggestTags);

const suggestions = await suggestTagsAction({
  content: "const [state, setState] = useState(0);",
  language: "javascript"
});

// Returns: ["react", "hooks", "state", "useState"]
```

**Usage Flow:**
1. User saves snippet
2. AI generates tag suggestions automatically
3. Suggestions appear as clickable pills below tag input
4. User can accept/dismiss individual suggestions

**UI Example:**
```typescript
{aiTagSuggestions.map((tag) => (
  <button
    key={tag}
    onClick={() => acceptAiTag(tag)}
    className='flex items-center gap-0.5 px-2 py-0.5 rounded-full border border-purple-300'
  >
    <Plus className='w-2.5 h-2.5' />
    {tag}
  </button>
))}
```

### Title Generation

**Action:** `api.actions.ai.generateTitle`

**Parameters:**
```typescript
{
  content: string;   // Code snippet
  language: string;  // Programming language
}
```

**Returns:** `string` (suggested title, max ~50 chars)

**Example:**
```typescript
const generateTitleAction = useAction(api.actions.ai.generateTitle);

const title = await generateTitleAction({
  content: "function fetchData() { return fetch('/api/data'); }",
  language: "javascript"
});

// Returns: "Fetch Data API Helper"
```

**UI Implementation:**
```typescript
<Button
  type='button'
  variant='outline'
  size='icon'
  onClick={handleGenerateTitle}
  title='Generate title with AI'
>
  {generatingTitle ? (
    <Loader2 className='w-4 h-4 animate-spin' />
  ) : (
    <Sparkles className='w-4 h-4' />
  )}
</Button>
```

## Subscription Operations

### Stripe Integration

**Environment Variables:**
```bash
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=wh