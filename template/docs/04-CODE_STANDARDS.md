# 📝 Code Standards & Quality

Comprehensive coding standards and quality guidelines for Next.js projects.

## Table of Contents

- [Overview](#overview)
- [TypeScript Standards](#typescript-standards)
- [Code Formatting](#code-formatting)
- [ESLint Configuration](#eslint-configuration)
- [Naming Conventions](#naming-conventions)
- [Code Organization](#code-organization)
- [Comments and Documentation](#comments-and-documentation)
- [Git Workflow](#git-workflow)
- [Code Review Guidelines](#code-review-guidelines)

## Overview

Consistent code standards ensure:
- **Readability** - Code is easy to understand
- **Maintainability** - Changes are easy to make
- **Collaboration** - Team members can work together effectively
- **Quality** - Fewer bugs and issues

### Tools We Use

| Tool | Purpose |
|------|---------|
| **TypeScript** | Type safety and better IDE support |
| **ESLint** | Code linting and error detection |
| **Prettier** | Code formatting |
| **Husky** | Git hooks for automation |
| **lint-staged** | Run linters on staged files |
| **Commitlint** | Enforce commit message conventions |

## TypeScript Standards

### Always Use TypeScript

```typescript
// ✅ Good: TypeScript file with types
interface User {
  id: string;
 name: string;
  email: string;
}

export function getUser(id: string): Promise<User> {
  return fetch(`/api/users/${id}`).then((res) => res.json());
}

// ❌ Bad: JavaScript without types
export function getUser(id) {
  return fetch(`/api/users/${id}`).then((res) => res.json());
}
```

### Strict Mode Configuration

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    },
    
    // Strict mode options
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Type Definitions

**Prefer interfaces over types for object shapes:**

```typescript
// ✅ Good: Interface for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ Good: Type for unions/intersections
type Status = "pending" | "approved" | "rejected";
type UserWithStatus = User & { status: Status };

// ❌ Bad: Type when interface would be better
type User = {
  id: string;
  name: string;
};
```

**Avoid using `any`:**

```typescript
// ❌ Bad: Using any
function processData(data: any) {
  return data.value;
}

// ✅ Good: Proper typing
interface DataType {
  value: string;
}

function processData(data: DataType) {
  return data.value;
}

// ✅ Good: Use unknown for truly unknown types
function processUnknown(data: unknown) {
  if (typeof data === "object" && data !== null && "value" in data) {
    return (data as DataType).value;
  }
  throw new Error("Invalid data");
}
```

**Use utility types:**

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

// Partial - make all properties optional
type PartialUser = Partial<User>;

// Omit - exclude specific properties
type UserWithoutPassword = Omit<User, "password">;

// Pick - select specific properties
type UserCredentials = Pick<User, "email" | "password">;

// Required - make all properties required
type RequiredUser = Required<PartialUser>;

// Readonly - make all properties readonly
type ImmutableUser = Readonly<User>;

// Record - create object type with specific keys
type UserRoles = Record<string, "admin" | "user" | "guest">;
```

### Props and Component Types

```typescript
// ✅ Good: Explicit props interface
interface ButtonProps {
  /** Button label */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Visual variant */
  variant?: "primary" | "secondary";
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Child elements */
  children?: React.ReactNode;
}

export function Button({
  label,
  onClick,
  variant = "primary",
  disabled = false,
  className,
  children,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children || label}
    </button>
  );
}

// ❌ Bad: No type definition
export function Button(props) {
  return <button {...props} />;
}
```

### Generic Types

```typescript
// Generic function
function identity<T>(arg: T): T {
  return arg;
}

// Generic interface
interface Response<T> {
  data: T;
  status: number;
  message: string;
}

// Generic React component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

export function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage
<List<User>
  items={users}
  renderItem={(user) => <span>{user.name}</span>}
/>
```

## Code Formatting

### Prettier Configuration

`.prettierrc.json`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 80,
  "endOfLine": "lf",
  "arrowParens": "always",
  "bracketSpacing": true,
  "jsxSingleQuote": false,
  "proseWrap": "preserve"
}
```

### Formatting Rules

**Consistent indentation:**

```typescript
// ✅ Good: 2 spaces
function example() {
  if (condition) {
    doSomething();
  }
}

// ❌ Bad: Mixed indentation
function example() {
    if (condition) {
      doSomething();
    }
}
```

**Line length:**

```typescript
// ✅ Good: Break long lines
const result = await fetchUserData(
  userId,
  includeProfile,
  includeSettings
);

// ❌ Bad: Long line
const result = await fetchUserData(userId, includeProfile, includeSettings, includePreferences, includeHistory);
```

**Import organization:**

```typescript
// ✅ Good: Organized imports
// External dependencies
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Internal components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Utilities
import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils/date";

// Types
import type { User } from "@/types/user.types";

// ❌ Bad: Random import order
import { cn } from "@/lib/utils/cn";
import React from "react";
import type { User } from "@/types/user.types";
import { Button } from "@/components/ui/button";
```

## ESLint Configuration

### Complete ESLint Setup

`.eslintrc.json`:

```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "react-hooks",
    "@typescript-eslint",
    "import",
    "unused-imports"
  ],
  "settings": {
    "react": {
      "version": "detect"
    },
    "import/resolver": {
      "typescript": {},
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  "rules": {
    // React rules
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/jsx-uses-react": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    
    // TypeScript rules
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-non-null-assertion": "warn",
    
    // Import rules
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        "vars": "all",
        "varsIgnorePattern": "^_",
        "args": "after-used",
        "argsIgnorePattern": "^_"
      }
    ],
    "import/order": [
      "warn",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "object",
          "type"
        ],
        "pathGroups": [
          {
            "pattern": "@/**",
            "group": "internal"
          }
        ],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }
    ],
    
    // General rules
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-debugger": "warn",
    "no-alert": "warn",
    "prefer-const": "error",
    "no-var": "error",
    "eqeqeq": ["error", "always"],
    "curly": ["error", "all"],
    "complexity": ["warn", 10]
  }
}
```

### Custom ESLint Rules

Create `.eslintrc.local.json` for project-specific rules:

```json
{
  "extends": "./.eslintrc.json",
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          {
            "group": ["../*"],
            "message": "Use absolute imports with @ instead"
          }
        ]
      }
    ],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "interface",
        "format": ["PascalCase"],
        "custom": {
          "regex": "^I[A-Z]",
          "match": false
        }
      }
    ]
  }
}
```

## Naming Conventions

### Variables and Functions

```typescript
// ✅ Good: camelCase for variables and functions
const userName = "John";
const isActive = true;
function getUserById(id: string) {}
async function fetchUserData() {}

// ❌ Bad: Other cases
const user_name = "John";
const UserName = "John";
function get_user_by_id(id: string) {}
```

### Constants

```typescript
// ✅ Good: UPPER_SNAKE_CASE for constants
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = "https://api.example.com";
const DEFAULT_PAGE_SIZE = 10;

// ❌ Bad: Other cases
const maxRetryAttempts = 3;
const apiBaseUrl = "https://api.example.com";
```

### Classes and Interfaces

```typescript
// ✅ Good: PascalCase
class UserService {}
interface UserProfile {}
type UserStatus = "active" | "inactive";

// ❌ Bad: Prefixing interfaces with 'I'
interface IUserProfile {} // Don't do this

// ❌ Bad: Other cases
class userService {}
interface user_profile {}
```

### Components

```typescript
// ✅ Good: PascalCase, descriptive names
export function UserProfileCard() {}
export function DashboardHeader() {}
export function LoginForm() {}

// ❌ Bad: Not descriptive enough
export function Card() {} // Too generic
export function Form() {} // Too generic
export function Component1() {} // Not descriptive
```

### Files and Folders

```
✅ Good:
components/
  UserCard.tsx
  DashboardLayout.tsx
hooks/
  useAuth.ts
  useLocalStorage.ts
lib/
  api-client.ts
  date-utils.ts

❌ Bad:
components/
  user_card.tsx
  Dashboard-Layout.tsx
hooks/
  UseAuth.ts
lib/
  apiClient.ts
```

### Boolean Variables

```typescript
// ✅ Good: Use is/has/should prefix
const isLoading = true;
const hasPermission = false;
const shouldRedirect = true;
const canEdit = false;

// ❌ Bad: Unclear meaning
const loading = true;
const permission = false;
const redirect = true;
```

### Event Handlers

```typescript
// ✅ Good: Use handle prefix
function handleClick() {}
function handleSubmit() {}
function handleChange() {}

// ✅ Good: Pass as on* props
<Button onClick={handleClick} />
<Form onSubmit={handleSubmit} />

// ❌ Bad: Unclear naming
function click() {}
function submit() {}
function doSomething() {}
```

## Code Organization

### File Structure

**One component per file:**

```typescript
// ✅ Good: UserCard.tsx
export function UserCard({ user }: UserCardProps) {
  return <div>{user.name}</div>;
}

// ❌ Bad: components.tsx with multiple components
export function UserCard() {}
export function UserList() {}
export function UserProfile() {}
```

**Group related functionality:**

```
features/
  user/
    components/
      UserCard.tsx
      UserList.tsx
    hooks/
      useUserData.ts
    types/
      user.types.ts
    index.ts
```

### Function Organization

```typescript
// ✅ Good: Logical order
export function UserProfile({ userId }: UserProfileProps) {
  // 1. Hooks
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // 2. Derived state
  const fullName = `${user?.firstName} ${user?.lastName}`;

  // 3. Effects
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  // 4. Event handlers
  const handleEdit = () => {
    router.push(`/users/${userId}/edit`);
  };

  // 5. Helper functions
  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  // 6. Early returns
  if (!user) {
    return <LoadingSpinner />;
  }

  // 7. Render
  return (
    <div>
      <h1>{fullName}</h1>
      <button onClick={handleEdit}>Edit</button>
    </div>
  );
}
```

### Complexity Management

```typescript
// ❌ Bad: Too complex
function processUser(user: User) {
  if (user.isActive) {
    if (user.hasPermission) {
      if (user.verified) {
        if (user.subscription) {
          // Deep nesting...
        }
      }
    }
  }
}

// ✅ Good: Early returns
function processUser(user: User) {
  if (!user.isActive) return;
  if (!user.hasPermission) return;
  if (!user.verified) return;
  if (!user.subscription) return;

  // Main logic
}

// ✅ Good: Extract to smaller functions
function canProcessUser(user: User): boolean {
  return (
    user.isActive &&
    user.hasPermission &&
    user.verified &&
    !!user.subscription
  );
}

function processUser(user: User) {
  if (!canProcessUser(user)) return;

  // Main logic
}
```

## Comments and Documentation

### JSDoc Comments

```typescript
/**
 * Fetches user data from the API
 * @param userId - The unique identifier of the user
 * @param options - Optional fetch options
 * @returns Promise resolving to user data
 * @throws {Error} If user is not found
 * @example
 * ```ts
 * const user = await fetchUser('123');
 * console.log(user.name);
 * ```
 */
export async function fetchUser(
  userId: string,
  options?: FetchOptions
): Promise<User> {
  // Implementation
}
```

### Inline Comments

```typescript
// ✅ Good: Explain WHY, not WHAT
// Using setTimeout to debounce rapid clicks
setTimeout(() => handleClick(), 300);

// Normalize email to lowercase for case-insensitive comparison
const normalizedEmail = email.toLowerCase();

// ❌ Bad: Stating the obvious
// Set the name variable to user.name
const name = user.name;

// Loop through users
users.forEach((user) => {});
```

### TODO Comments

```typescript
// TODO: Add validation for email format
// FIXME: This breaks on mobile devices
// HACK: Temporary workaround until API is fixed
// NOTE: This assumes UTC timezone
```

## Git Workflow

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>(<scope>): <subject>

<body>

<footer>

# Types
feat: New feature
fix: Bug fix
docs: Documentation changes
style: Code style changes (formatting)
refactor: Code refactoring
perf: Performance improvements
test: Adding or updating tests
build: Build system changes
ci: CI/CD changes
chore: Other changes (dependencies, config)
revert: Revert a previous commit

# Examples
feat(auth): add Google OAuth login
fix(api): handle null response from user endpoint
docs(readme): update installation instructions
refactor(utils): extract date formatting to separate file
test(user): add unit tests for user service
chore(deps): upgrade nextjs to 14.0.0
```

### Branch Naming

```bash
# Format
<type>/<description>

# Examples
feature/user-authentication
fix/login-redirect-bug
hotfix/security-vulnerability
refactor/api-client-cleanup
docs/api-documentation
```

### Husky Hooks

`.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

`.husky/commit-msg`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit ${1}
```

`.husky/pre-push`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run type-check
npm run lint
npm run test
```

### lint-staged Configuration

`package.json`:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,mdx,css,html,yml,yaml,scss}": [
      "prettier --write"
    ]
  }
}
```

## Code Review Guidelines

### For Authors

**Before submitting:**
- [ ] Code follows style guide
- [ ] All tests pass
- [ ] No console.logs or debuggers
- [ ] Types are properly defined
- [ ] Comments explain complex logic
- [ ] Documentation is updated
- [ ] No unnecessary dependencies added

**PR Description should include:**
- What changes were made
- Why changes were necessary
- How to test the changes
- Screenshots (if UI changes)
- Related issues/tickets

### For Reviewers

**Check for:**
- [ ] Code quality and readability
- [ ] Proper error handling
- [ ] Security vulnerabilities
- [ ] Performance implications
- [ ] Test coverage
- [ ] Accessibility considerations
- [ ] Breaking changes

**Review checklist:**
```markdown
## Code Review Checklist

### Functionality
- [ ] Code works as intended
- [ ] Edge cases are handled
- [ ] Error handling is appropriate

### Code Quality
- [ ] Follows coding standards
- [ ] No code duplication
- [ ] Functions are small and focused
- [ ] Variable names are descriptive

### Testing
- [ ] Unit tests are included
- [ ] Tests are meaningful
- [ ] All tests pass

### Security
- [ ] No security vulnerabilities
- [ ] Input validation present
- [ ] Sensitive data is protected

### Performance
- [ ] No unnecessary re-renders
- [ ] Efficient algorithms used
- [ ] No memory leeks

### Documentation
- [ ] Code is well-commented
- [ ] README is updated
- [ ] API docs are updated
```

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [ESLint Rules](https://eslint.org/docs/latest/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)

---

**Next:** [Testing Guide](./TESTING.md) →
