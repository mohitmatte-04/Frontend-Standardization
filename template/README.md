# Next.js Frontend Standardization Template

A production-ready Next.js template with pre-configured best practices, tooling, and documentation.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Set up git hooks
npm run prepare

# Start development
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## What's Included

- ✅ **Next.js 15** with App Router
- ✅ **TypeScript** with strict mode
- ✅ **Tailwind CSS** + **shadcn/ui** + **DaisyUI**
- ✅ **ESLint** + **Prettier** configured
- ✅ **Husky** + **Commitlint** for git hooks
- ✅ **Jest** + **React Testing Library**
- ✅ **GitHub Actions** CI/CD
- ✅ **Complete Documentation** in `/docs`

## Available Scripts

```bash
npm run dev              # Development server
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Check linting
npm run lint:fix         # Fix linting errors
npm run format           # Format code
npm run type-check       # TypeScript check
npm run test             # Run tests
npm run test:coverage    # Test coverage
```

## Project Structure

```
├── .github/          # CI/CD workflows
├── .husky/           # Git hooks
├── public/           # Static assets
├── src/
│   ├── app/         # Next.js pages & routes
│   ├── components/  # React components
│   ├── hooks/       # Custom hooks
│   ├── lib/         # Utilities
│   └── types/       # TypeScript types
├── tests/           # Test files
└── docs/            # Documentation
```

## Documentation

All standardization guidelines are in the `/docs` folder:

- **[Getting Started](docs/GETTING_STARTED.md)** - Introduction and setup
- **[Installation](docs/INSTALLATION.md)** - Detailed installation guide  
- **[Project Structure](docs/PROJECT_STRUCTURE.md)** - Code organization
- **[Components](docs/COMPONENTS.md)** - UI component usage
- **[Code Standards](docs/CODE_STANDARDS.md)** - Coding guidelines
- **[Authentication](docs/AUTHENTICATION.md)** - Auth implementation
- **[Security](docs/SECURITY.md)** - Security best practices
- **[Testing](docs/TESTING.md)** - Testing guidelines
- **[Deployment](docs/DEPLOYMENT.md)** - Deployment instructions
- **[Cheat Sheet](docs/CHEAT_SHEET.md)** - Quick reference

## First Steps After Cloning

1. Update `package.json` with your project details
2. Configure `.env.local` with your environment variables
3. Customize branding in `src/app/layout.tsx`
4. Read the documentation in `/docs`
5. Start building!

## Adding UI Components

```bash
# Add shadcn/ui components
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu

# DaisyUI components work via CSS classes
# See: https://daisyui.com/components/
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

**For detailed guidance, check the `/docs` folder.**
