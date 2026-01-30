# ⚡ Quick Reference Cheat Sheet

Quick reference for common commands and patterns in our Next.js standardization.

## Table of Contents

- [Common Commands](#common-commands)
- [Quick Setup](#quick-setup)
- [Code Snippets](#code-snippets)
- [Git Workflow](#git-workflow)
- [Troubleshooting](#troubleshooting)

## Common Commands

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Type check
npm run type-check

# Lint code
npm run lint
npm run lint:fix

# Format code
npm run format
npm run format:check
```

### Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### Component Generation

```bash
# Install shadcn/ui component
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add form

# Install multiple components
npx shadcn-ui@latest add button card dialog input
```

### Database (if using Prisma)

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset
```

## Quick Setup

### New Project from Scratch

```bash
# Create Next.js app
npx create-next-app@latest my-app --typescript --tailwind --app --src-dir

cd my-app

# Install shadcn/ui
npx shadcn-ui@latest init

# Install DaisyUI
npm install -D daisyui@latest

# Install development tools
npm install -D eslint-plugin-import eslint-plugin-unused-imports
npm install -D prettier eslint-config-prettier
npm install -D husky lint-staged
npm install -D @commitlint/cli @commitlint/config-conventional

# Initialize Husky
npx husky-init && npm install

# Start development
npm run dev
```

### Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Generate NextAuth secret
openssl rand -base64 32

# Edit .env.local with your values
```

## Code Snippets

### React Component

```typescript
interface ComponentNameProps {
  title: string;
  onClick?: () => void;
  className?: string;
}

export function ComponentName({ 
  title, 
  onClick, 
  className 
}: ComponentNameProps) {
  return (
    <div className={cn("base-classes", className)} onClick={onClick}>
      <h1>{title}</h1>
    </div>
  );
}
```

### Server Component

```typescript
export default async function Page({ params }: { params: { id: string } }) {
  const data = await fetchData(params.id);

  return (
    <div>
      <h1>{data.title}</h1>
    </div>
  );
}
```

### Client Component

```typescript
'use client';

import { useState } from 'react';

export function ClientComponent() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### API Route

```typescript
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const data = await fetchData();
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createData(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Bad Request' },
      { status: 400 }
    );
  }
}
```

### Custom Hook

```typescript
export function useCustomHook(initialValue: any) {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Side effects here
  }, []);

  const updateState = (newValue: any) => {
    setState(newValue);
  };

  return { state, updateState };
}
```

### Zod Schema

```typescript
import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  age: z.number().int().min(18).optional(),
});

export type User = z.infer<typeof userSchema>;
```

### Form with React Hook Form

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

## Git Workflow

### Feature Development

```bash
# Update develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/my-feature

# Create pull request on GitHub
```

### Commit Message Format

```bash
# Format
<type>(<scope>): <subject>

# Examples
feat(auth): add Google OAuth login
fix(api): handle null response
docs(readme): update installation steps
refactor(utils): simplify date formatting
test(user): add unit tests for user service
chore(deps): upgrade next to 14.0.0
```

### Syncing with Upstream

```bash
# Add upstream if not already added
git remote add upstream https://github.com/original/repo.git

# Fetch upstream changes
git fetch upstream

# Merge upstream changes
git checkout develop
git merge upstream/develop

# Push to your fork
git push origin develop
```

## Troubleshooting

### Common Issues

**Issue: Module not found**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue: Type errors**
```bash
# Regenerate types
rm -rf .next
npm run build
```

**Issue: Port already in use**
```bash
# Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9

# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Issue: ESLint not working**
```bash
# Clear ESLint cache
rm -rf node_modules/.cache
npm run lint -- --cache-location .eslintcache
```

**Issue: Husky hooks not running**
```bash
# Reinstall Husky
rm -rf .husky
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
chmod +x .husky/*
```

### Performance Issues

```bash
# Analyze bundle size
npm run build
npm run analyze

# Check for large dependencies
npx webpack-bundle-analyzer .next/analyze/client.json
```

### Database Issues (Prisma)

```bash
# Reset database
npx prisma migrate reset

# Force push schema
npx prisma db push --force-reset

# View database in browser
npx prisma studio
```

## Keyboard Shortcuts (VS Code)

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + P` | Quick file open |
| `Ctrl/Cmd + Shift + P` | Command palette |
| `Shift + Alt + F` | Format document |
| `Ctrl/Cmd + /` | Toggle comment |
| `Ctrl/Cmd + D` | Select next occurrence |
| `Alt + Up/Down` | Move line up/down |
| `Ctrl/Cmd + B` | Toggle sidebar |
| `Ctrl/Cmd + `` ` `` | Toggle terminal |

## Useful VS Code Extensions

- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- GitLens
- Thunder Client (API testing)
- Error Lens
- Auto Rename Tag
- Path Intellisense

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

---

**Need more help?** Check the full documentation in the `/docs` folder.
