# 📦 Installation Guide

Complete step-by-step installation guide for setting up a standardized Next.js project.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation Methods](#installation-methods)
- [Initial Setup](#initial-setup)
- [Development Tools Setup](#development-tools-setup)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

| Software | Minimum Version | Recommended Version | Installation Link |
|----------|----------------|---------------------|-------------------|
| Node.js | 18.0.0 | 20.x LTS | [Download](https://nodejs.org/) |
| npm | 9.0.0 | Latest | Included with Node.js |
| Git | 2.0.0 | Latest | [Download](https://git-scm.com/) |

### Optional but Recommended

- **VS Code** - [Download](https://code.visualstudio.com/)
- **VS Code Extensions**:
  - ESLint
  - Prettier - Code formatter
  - Tailwind CSS IntelliSense
  - TypeScript Vue Plugin (Volar)
  - GitLens

### Verify Installation

```bash
# Check Node.js version
node --version
# Should output: v18.x.x or higher

# Check npm version
npm --version
# Should output: 9.x.x or higher

# Check Git version
git --version
# Should output: git version 2.x.x or higher
```

## Installation Methods

### Method 1: Using create-next-app (Recommended)

This is the fastest way to get started with a new project.

```bash
# Create new project
npx create-next-app@latest my-app --typescript --tailwind --app --src-dir --import-alias "@/*"

# Navigate to project
cd my-app
```

**CLI Prompts:**
```
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like to use `src/` directory? … Yes
✔ Would you like to use App Router? … Yes
✔ Would you like to customize the default import alias? … No
```

### Method 2: Clone Template Repository

Clone our pre-configured standardization template.

```bash
# Clone the template
git clone https://github.com/your-org/nextjs-standardization-template.git my-app

# Navigate to project
cd my-app

# Remove existing git history
rm -rf .git

# Initialize new git repository
git init
git add .
git commit -m "chore: initial commit from template"
```

### Method 3: Manual Setup

Start from scratch and configure everything manually.

```bash
# Create new Next.js app
npx create-next-app@latest my-app

# Navigate to project
cd my-app
```

## Initial Setup

### 1. Install Dependencies

```bash
# Install all dependencies
npm install

# Or using yarn
yarn install
```

### 2. Install shadcn/ui

shadcn/ui is our primary component library.

```bash
# Initialize shadcn/ui
npx shadcn-ui@latest init
```

**Configuration prompts:**
```
✔ Would you like to use TypeScript? … yes
✔ Which style would you like to use? › Default
✔ Which color would you like to use as base color? › Slate
✔ Where is your global CSS file? … src/app/globals.css
✔ Would you like to use CSS variables for colors? … yes
✔ Where is your tailwind.config.js located? … tailwind.config.ts
✔ Configure the import alias for components: … @/components
✔ Configure the import alias for utils: … @/lib/utils
✔ Are you using React Server Components? … yes
```

**Install commonly used components:**

```bash
# Install essential components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add form
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add table
npx shadcn-ui@latest add tabs
```

### 3. Install DaisyUI

DaisyUI provides additional pre-built components.

```bash
# Install DaisyUI
npm install -D daisyui@latest
```

**Update `tailwind.config.ts`:**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    themes: ["light", "dark", "cupcake"],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
  },
};

export default config;
```

### 4. Environment Variables

Create environment files:

```bash
# Create .env.local file
cp .env.example .env.local
```

**Edit `.env.local`:**

```bash
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="My Next.js App"

# Database (if using)
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

GITHUB_ID=your-github-id
GITHUB_SECRET=your-github-secret

# API Keys
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

**Create `.env.example`:**

```bash
# Copy structure from .env.local but remove actual values
# This file should be committed to git
```

## Development Tools Setup

### 1. Install Code Quality Tools

```bash
# Install ESLint plugins
npm install -D eslint-plugin-import eslint-plugin-unused-imports @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Install Prettier
npm install -D --exact prettier eslint-config-prettier eslint-plugin-prettier

# Install Husky
npm install -D husky

# Initialize Husky
npx husky-init && npm install

# Install lint-staged
npm install -D lint-staged

# Install Commitlint
npm install -D @commitlint/cli @commitlint/config-conventional
```

### 2. Configure ESLint

Create `.eslintrc.json`:

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
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/no-unused-vars": "off",
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
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

### 3. Configure Prettier

Create `.prettierrc.json`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 80,
  "endOfLine": "lf",
  "arrowParens": "always"
}
```

Create `.prettierignore`:

```
# dependencies
node_modules
.pnp
.pnp.js

# testing
coverage

# next.js
.next
out
build
dist

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# env files
.env*.local
.env

# vercel
.vercel
```

### 4. Configure Husky

```bash
# Create pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"

# Create commit-msg hook
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit ${1}'

# Create pre-push hook
npx husky add .husky/pre-push "npm run type-check && npm run lint"
```

### 5. Configure lint-staged

Add to `package.json`:

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

### 6. Configure Commitlint

Create `commitlint.config.js`:

```javascript
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert",
      ],
    ],
  },
};
```

### 7. Update package.json Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "prepare": "husky install"
  }
}
```

## Verification

### 1. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app.

### 2. Run Linting

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix
```

### 3. Run Type Checking

```bash
npm run type-check
```

### 4. Test Format

```bash
# Check formatting
npm run format:check

# Format all files
npm run format
```

### 5. Test Git Hooks

```bash
# Create a test file
echo "const test = 'hello world'" > test.ts

# Stage the file
git add test.ts

# Try to commit (this will trigger hooks)
git commit -m "test: verify git hooks"

# If everything works, the commit should succeed
# Clean up
rm test.ts
git reset HEAD~1
```

## Troubleshooting

### Common Issues

#### Issue: "Cannot find module 'next'"

**Solution:**
```bash
# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

#### Issue: ESLint not working in VS Code

**Solution:**
1. Install ESLint extension for VS Code
2. Add to `.vscode/settings.json`:
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

#### Issue: Husky hooks not running

**Solution:**
```bash
# Reinstall Husky
npm uninstall husky
npm install -D husky
npx husky install

# Make hooks executable (Unix/Mac)
chmod +x .husky/*
```

#### Issue: Prettier and ESLint conflicts

**Solution:**
```bash
# Make sure eslint-config-prettier is installed
npm install -D eslint-config-prettier

# Ensure "prettier" is the last item in extends array in .eslintrc.json
```

### Getting Help

If you encounter issues:

1. Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)
2. Search existing [GitHub Issues](https://github.com/your-org/nextjs-standardization/issues)
3. Ask in team chat or create a new issue

## Next Steps

After successful installation:

1. 📖 Read the [Project Structure Guide](./PROJECT_STRUCTURE.md)
2. 🎨 Review [Component Guidelines](./COMPONENTS.md)
3. 🔐 Set up [Authentication](./AUTHENTICATION.md)
4. 🛡️ Review [Security Best Practices](./SECURITY.md)
5. ✅ Set up [Testing](./TESTING.md)

---

**Happy coding! 🚀**
