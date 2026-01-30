# 📁 Project Structure Guide

A comprehensive guide to organizing your Next.js application for scalability and maintainability.

## Table of Contents

- [Overview](#overview)
- [Directory Structure](#directory-structure)
- [File Naming Conventions](#file-naming-conventions)
- [Module Organization](#module-organization)
- [Best Practices](#best-practices)

## Overview

Our project structure follows Next.js App Router conventions while incorporating industry best practices for scalability. The structure is designed to:

- ✅ Support feature-based organization
- ✅ Enable easy code discovery
- ✅ Facilitate testing
- ✅ Scale with your application
- ✅ Maintain clear separation of concerns

## Directory Structure

### Complete Project Tree

```
my-nextjs-app/
├── .github/                           # GitHub specific files
│   ├── workflows/                    # GitHub Actions
│   │   ├── ci.yml                   # Continuous Integration
│   │   ├── cd.yml                   # Continuous Deployment
│   │   └── pr-checks.yml            # Pull Request checks
│   ├── ISSUE_TEMPLATE/              # Issue templates
│   └── PULL_REQUEST_TEMPLATE.md     # PR template
│
├── .husky/                           # Git hooks
│   ├── pre-commit                   # Pre-commit hook
│   ├── commit-msg                   # Commit message hook
│   └── pre-push                     # Pre-push hook
│
├── .vscode/                          # VS Code settings
│   ├── settings.json                # Workspace settings
│   ├── extensions.json              # Recommended extensions
│   └── launch.json                  # Debug configurations
│
├── public/                           # Static assets
│   ├── images/                      # Image assets
│   │   ├── logo.svg
│   │   └── icons/
│   ├── fonts/                       # Custom fonts
│   ├── favicon.ico                  # Favicon
│   └── robots.txt                   # SEO robots file
│
├── src/                              # Source code
│   ├── app/                         # Next.js App Router
│   │   ├── (auth)/                 # Auth route group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx          # Auth layout
│   │   │
│   │   ├── (dashboard)/            # Dashboard route group
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx          # Dashboard layout
│   │   │
│   │   ├── api/                    # API routes
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── users/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   └── health/
│   │   │       └── route.ts
│   │   │
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Home page
│   │   ├── loading.tsx             # Loading UI
│   │   ├── error.tsx               # Error UI
│   │   ├── not-found.tsx           # 404 page
│   │   └── globals.css             # Global styles
│   │
│   ├── components/                  # React components
│   │   ├── ui/                     # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   │
│   │   ├── forms/                  # Form components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ProfileForm.tsx
│   │   │
│   │   ├── layouts/                # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Navigation.tsx
│   │   │
│   │   ├── features/               # Feature-specific components
│   │   │   ├── user/
│   │   │   │   ├── UserCard.tsx
│   │   │   │   ├── UserList.tsx
│   │   │   │   └── UserProfile.tsx
│   │   │   └── dashboard/
│   │   │       ├── DashboardStats.tsx
│   │   │       └── RecentActivity.tsx
│   │   │
│   │   └── shared/                 # Shared components
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── EmptyState.tsx
│   │       └── PageHeader.tsx
│   │
│   ├── lib/                        # Utility libraries
│   │   ├── auth/                   # Authentication utilities
│   │   │   ├── authOptions.ts
│   │   │   ├── session.ts
│   │   │   └── permissions.ts
│   │   │
│   │   ├── api/                    # API clients and utilities
│   │   │   ├── client.ts          # Axios instance
│   │   │   ├── endpoints.ts       # API endpoints
│   │   │   └── fetcher.ts         # Data fetching utilities
│   │   │
│   │   ├── validators/             # Validation schemas
│   │   │   ├── user.schema.ts
│   │   │   └── auth.schema.ts
│   │   │
│   │   ├── utils/                  # Helper functions
│   │   │   ├── cn.ts              # Class name utility
│   │   │   ├── format.ts          # Formatting utilities
│   │   │   ├── date.ts            # Date utilities
│   │   │   └── string.ts          # String utilities
│   │   │
│   │   └── constants.ts            # App constants
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   ├── useMediaQuery.ts
│   │   └── useToast.ts
│   │
│   ├── store/                      # State management
│   │   ├── authStore.ts           # Authentication store
│   │   ├── uiStore.ts             # UI state store
│   │   └── userStore.ts           # User data store
│   │
│   ├── types/                      # TypeScript definitions
│   │   ├── index.ts               # Main type exports
│   │   ├── api.types.ts           # API response types
│   │   ├── auth.types.ts          # Auth types
│   │   ├── user.types.ts          # User types
│   │   └── global.d.ts            # Global type declarations
│   │
│   ├── styles/                     # Styling files
│   │   ├── globals.css            # Global styles
│   │   └── themes/                # Theme configurations
│   │       ├── light.css
│   │       └── dark.css
│   │
│   ├── config/                     # Configuration files
│   │   ├── app.config.ts          # App configuration
│   │   ├── navigation.config.ts   # Navigation config
│   │   └── seo.config.ts          # SEO configuration
│   │
│   └── middleware.ts               # Next.js middleware
│
├── tests/                           # Test files
│   ├── unit/                       # Unit tests
│   │   ├── components/
│   │   ├── hooks/
│   │   └── lib/
│   │
│   ├── integration/                # Integration tests
│   │   └── api/
│   │
│   ├── e2e/                        # End-to-end tests
│   │   ├── auth.spec.ts
│   │   └── dashboard.spec.ts
│   │
│   └── setup/                      # Test setup files
│       ├── jest.setup.ts
│       └── test-utils.tsx
│
├── docs/                            # Documentation
│   ├── INSTALLATION.md
│   ├── PROJECT_STRUCTURE.md
│   ├── COMPONENTS.md
│   └── ...
│
├── .env.example                     # Environment variables template
├── .env.local                       # Local environment (gitignored)
├── .eslintrc.json                   # ESLint configuration
├── .prettierrc.json                 # Prettier configuration
├── .gitignore                       # Git ignore rules
├── commitlint.config.js             # Commitlint configuration
├── jest.config.js                   # Jest configuration
├── next.config.js                   # Next.js configuration
├── tailwind.config.ts               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Dependencies and scripts
├── README.md                        # Project README
└── LICENSE                          # License file
```

## File Naming Conventions

### Components

```
✅ Correct:
- UserCard.tsx
- DashboardLayout.tsx
- LoginForm.tsx

❌ Incorrect:
- userCard.tsx
- dashboard_layout.tsx
- login-form.tsx
```

**Rules:**
- Use **PascalCase** for component files
- Name files after their default export
- Use `.tsx` extension for components with JSX

### Utilities and Hooks

```
✅ Correct:
- useAuth.ts
- formatDate.ts
- api-client.ts

❌ Incorrect:
- UseAuth.ts
- FormatDate.ts
- apiClient.ts
```

**Rules:**
- Use **camelCase** for hooks (must start with "use")
- Use **kebab-case** for utility files
- Use `.ts` extension for non-React files

### Types and Interfaces

```
✅ Correct:
- user.types.ts
- api.types.ts
- global.d.ts

❌ Incorrect:
- User.types.ts
- apiTypes.ts
- types.ts
```

**Rules:**
- Use **kebab-case** for type definition files
- Use `.types.ts` suffix for type-only files
- Use `.d.ts` for declaration files

### Route Files

```
✅ Correct:
- page.tsx        (page component)
- layout.tsx      (layout component)
- loading.tsx     (loading UI)
- error.tsx       (error UI)
- route.ts        (API route)

❌ Incorrect:
- index.tsx
- Page.tsx
- api.ts
```

**Rules:**
- Use Next.js reserved file names (lowercase)
- Follow App Router conventions

## Module Organization

### Feature-Based Structure

For complex features, use this structure:

```
src/components/features/user/
├── components/          # Feature components
│   ├── UserCard.tsx
│   └── UserList.tsx
├── hooks/              # Feature hooks
│   └── useUserData.ts
├── types/              # Feature types
│   └── user.types.ts
├── utils/              # Feature utilities
│   └── formatUser.ts
└── index.ts            # Barrel export
```

**Example `index.ts`:**

```typescript
// Export all feature components
export { UserCard } from "./components/UserCard";
export { UserList } from "./components/UserList";

// Export hooks
export { useUserData } from "./hooks/useUserData";

// Export types
export type { User, UserProfile } from "./types/user.types";
```

### Shared Components

```
src/components/shared/
├── LoadingSpinner.tsx
├── ErrorBoundary.tsx
├── EmptyState.tsx
└── PageHeader.tsx
```

These are reusable across the entire application.

### UI Components (shadcn/ui)

```
src/components/ui/
├── button.tsx
├── card.tsx
├── input.tsx
└── ...
```

These are from shadcn/ui library, copied into your project.

## Best Practices

### 1. Separation of Concerns

**❌ Bad:**
```typescript
// UserProfile.tsx - mixing business logic with UI
export function UserProfile() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(setUser);
  }, []);

  return <div>{user?.name}</div>;
}
```

**✅ Good:**
```typescript
// hooks/useUser.ts - business logic
export function useUser(id: string) {
  return useQuery(['user', id], () => fetchUser(id));
}

// components/UserProfile.tsx - UI only
export function UserProfile({ id }: { id: string }) {
  const { data: user, isLoading } = useUser(id);
  
  if (isLoading) return <LoadingSpinner />;
  return <div>{user?.name}</div>;
}
```

### 2. Barrel Exports

Use `index.ts` files to create clean imports:

**❌ Bad:**
```typescript
import { UserCard } from '@/components/features/user/components/UserCard';
import { UserList } from '@/components/features/user/components/UserList';
import { useUserData } from '@/components/features/user/hooks/useUserData';
```

**✅ Good:**
```typescript
// features/user/index.ts
export * from './components/UserCard';
export * from './components/UserList';
export * from './hooks/useUserData';

// Usage
import { UserCard, UserList, useUserData } from '@/components/features/user';
```

### 3. Consistent Import Paths

Use the `@/*` alias for all internal imports:

**✅ Good:**
```typescript
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils/cn';
```

### 4. Colocation

Keep related files close together:

```
features/dashboard/
├── DashboardPage.tsx
├── DashboardStats.tsx
├── DashboardChart.tsx
├── hooks/
│   └── useDashboardData.ts
└── types/
    └── dashboard.types.ts
```

### 5. Route Groups

Use route groups for logical organization without affecting URL structure:

```
app/
├── (marketing)/       # Public pages
│   ├── about/
│   └── pricing/
├── (dashboard)/       # Protected pages
│   ├── dashboard/
│   └── settings/
└── (auth)/           # Auth pages
    ├── login/
    └── register/
```

### 6. API Route Organization

```
app/api/
├── users/
│   ├── route.ts              # GET /api/users, POST /api/users
│   ├── [id]/
│   │   └── route.ts          # GET /api/users/:id, PUT, DELETE
│   └── [id]/
│       └── posts/
│           └── route.ts      # GET /api/users/:id/posts
```

### 7. Type Organization

**For small projects:**
```
types/
└── index.ts          # All types in one file
```

**For large projects:**
```
types/
├── index.ts          # Re-exports all types
├── api.types.ts
├── auth.types.ts
├── user.types.ts
└── global.d.ts
```

### 8. Configuration Files

Keep configuration at the root level:

```
/
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── jest.config.js
└── .eslintrc.json
```

### 9. Environment Variables

```
.env.local           # Local development (gitignored)
.env.development     # Development
.env.production      # Production
.env.example         # Template (committed to git)
```

### 10. Testing Structure

Mirror your source structure:

```
src/components/UserCard.tsx
tests/unit/components/UserCard.test.tsx

src/hooks/useAuth.ts
tests/unit/hooks/useAuth.test.ts
```

## Anti-Patterns to Avoid

### ❌ Don't Create Generic "Utils" Dumping Ground

```
utils/
└── index.ts    # 1000+ lines of random functions
```

**✅ Instead, organize by purpose:**
```
lib/
├── utils/
│   ├── format.ts
│   ├── date.ts
│   └── string.ts
├── validators/
│   └── user.schema.ts
└── api/
    └── client.ts
```

### ❌ Don't Nest Too Deeply

```
components/features/dashboard/components/stats/components/chart/
```

**✅ Keep it flat:**
```
components/features/dashboard/
├── DashboardStats.tsx
└── DashboardChart.tsx
```

### ❌ Don't Mix Concerns

```
components/
├── Button.tsx           # UI component
├── LoginForm.tsx        # Business logic component
└── api-helpers.ts       # API utility (wrong folder!)
```

**✅ Organize by concern:**
```
components/
├── ui/Button.tsx
└── forms/LoginForm.tsx

lib/
└── api/helpers.ts
```

## Migration Guide

If you have an existing project, migrate gradually:

1. **Start with new features** - Use the new structure
2. **Move shared components** - Extract to `components/shared`
3. **Organize by features** - Group related components
4. **Update imports** - Use path aliases
5. **Add barrel exports** - Simplify imports

## Tools and Scripts

### Useful Commands

```bash
# Generate component structure
npm run generate:component ComponentName

# Generate feature structure
npm run generate:feature FeatureName

# Analyze bundle size
npm run analyze
```

### VS Code Snippets

Add to `.vscode/snippets.code-snippets`:

```json
{
  "React Component": {
    "prefix": "rc",
    "body": [
      "interface ${1:ComponentName}Props {",
      "  $2",
      "}",
      "",
      "export function ${1:ComponentName}({ $3 }: ${1:ComponentName}Props) {",
      "  return (",
      "    <div>",
      "      $4",
      "    </div>",
      "  );",
      "}"
    ]
  }
}
```

## Resources

- [Next.js Project Structure](https://nextjs.org/docs/getting-started/project-structure)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

---

**Next:** [Component Guidelines](./COMPONENTS.md) →
