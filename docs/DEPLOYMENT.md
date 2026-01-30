# 🚀 Deployment Guide

Complete guide for deploying Next.js applications to production.

## Table of Contents

- [Deployment Overview](#deployment-overview)
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Vercel Deployment](#vercel-deployment)
- [Docker Deployment](#docker-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Environment Configuration](#environment-configuration)
- [Performance Optimization](#performance-optimization)
- [Monitoring & Logging](#monitoring--logging)

## Deployment Overview

### Deployment Options

| Platform | Best For | Pros | Cons |
|----------|---------|------|------|
| **Vercel** | Quick deployment, Next.js optimized | Zero-config, automatic scaling, edge functions | Vendor lock-in, limited control |
| **Docker** | Full control, any cloud provider | Portable, consistent environments | More setup required |
| **AWS** | Enterprise, complex infrastructure | Highly scalable, full AWS ecosystem | Complex setup, higher cost |
| **Google Cloud** | GCP ecosystem | Good scaling, Cloud Run simplicity | Learning curve |

### Deployment Architecture

```
┌──────────┐     ┌─────────┐     ┌──────────┐
│  Client  │────▶│   CDN   │────▶│  Next.js │
│ Browser  │     │  (Edge) │     │  Server  │
└──────────┘     └─────────┘     └──────────┘
                                       │
                                       ▼
                                 ┌──────────┐
                                 │ Database │
                                 └──────────┘
```

## Pre-Deployment Checklist

### Code Quality

- [ ] All tests passing (`npm run test`)
- [ ] TypeScript compilation successful (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] No console.log or debugger statements
- [ ] Code reviewed and approved

### Security

- [ ] All dependencies up to date (`npm audit`)
- [ ] Environment variables secured
- [ ] Authentication/authorization implemented
- [ ] Security headers configured
- [ ] HTTPS enabled
- [ ] Rate limiting implemented

### Performance

- [ ] Images optimized (using next/image)
- [ ] Bundle size checked (`npm run build`)
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals passing
- [ ] Lazy loading implemented

### SEO

- [ ] Meta tags configured
- [ ] sitemap.xml generated
- [ ] robots.txt configured
- [ ] Open Graph tags added
- [ ] Structured data implemented

### Documentation

- [ ] README updated
- [ ] API documentation current
- [ ] Environment variables documented
- [ ] Deployment process documented

## Vercel Deployment

### Quick Deploy

**Via CLI:**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Via GitHub Integration:**

1. Push code to GitHub
2. Import repository in Vercel dashboard
3. Configure project settings
4. Deploy automatically on push

### Vercel Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url"
  },
  "build": {
    "env": {
      "DATABASE_URL": "@database-url",
      "NEXTAUTH_SECRET": "@nextauth-secret"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "permanent": true
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.example.com/:path*"
    }
  ]
}
```

### Environment Variables in Vercel

```bash
# Add via CLI
vercel env add NEXTAUTH_SECRET production
vercel env add DATABASE_URL production

# Or via Vercel Dashboard:
# Settings > Environment Variables
```

### Vercel Deployment Workflow

```yaml
# .github/workflows/vercel-deploy.yml
name: Vercel Deployment

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "20"
      
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      
      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Build Project
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## Docker Deployment

### Dockerfile

Create `Dockerfile`:

```dockerfile
# Base image
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set correct permissions for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  nextjs:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - nextjs
    restart: unless-stopped

volumes:
  postgres_data:
```

### Next.js Configuration for Docker

Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // For Docker deployment
  
  // Other configurations...
};

module.exports = nextConfig;
```

### Build and Run Docker

```bash
# Build image
docker build -t my-nextjs-app .

# Run container
docker run -p 3000:3000 my-nextjs-app

# Using docker-compose
docker-compose up -d

# View logs
docker-compose logs -f nextjs

# Stop containers
docker-compose down
```

## CI/CD Pipeline

### GitHub Actions - Complete Pipeline

Create `.github/workflows/deploy.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '20'
  
jobs:
  # Job 1: Code Quality
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Type check
        run: npm run type-check
      
      - name: Format check
        run: npm run format:check

  # Job 2: Testing
  test:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  # Job 3: E2E Tests
  e2e:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/

  # Job 4: Build
  build:
    runs-on: ubuntu-latest
    needs: [test, e2e]
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: .next/

  # Job 5: Deploy to staging
  deploy-staging:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.example.com
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  # Job 6: Deploy to production
  deploy-production:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://example.com
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
      
      - name: Send Slack Notification
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Deployment to production completed!'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Environment Configuration

### Environment File Structure

```
.env.example          # Template (committed to git)
.env.local            # Local development (gitignored)
.env.development      # Development environment
.env.staging          # Staging environment
.env.production       # Production environment
```

### .env.example

```bash
# Application
NEXT_PUBLIC_APP_NAME=MyApp
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-min-32-characters

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# API Keys
API_SECRET_KEY=your-api-secret-key

# Monitoring (optional)
SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

### Environment Validation

```typescript
// lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  // Public variables
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string(),
  
  // Server variables
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  
  // Optional variables
  SENTRY_DSN: z.string().url().optional(),
});

export const env = envSchema.parse(process.env);
```

## Performance Optimization

### Next.js Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable modern JavaScript features
  swcMinify: true,
  
  // Optimize images
  images: {
    domains: ['example.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Compress responses
  compress: true,
  
  // Generate source maps in production
  productionBrowserSourceMaps: false,
  
  // Optimize fonts
  optimizeFonts: true,
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Optimize bundle
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
          },
        },
      };
    }
    
    return config;
  },
  
  // Experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@headlessui/react', 'lucide-react'],
  },
};

module.exports = nextConfig;
```

### Performance Checklist

- [ ] Enable SWC minification
- [ ] Use next/image for all images
- [ ] Implement lazy loading
- [ ] Use dynamic imports for large components
- [ ] Enable compression
- [ ] Optimize fonts with next/font
- [ ] Minimize JavaScript bundles
- [ ] Use server components where possible
- [ ] Implement caching strategies
- [ ] Use CDN for static assets

## Monitoring & Logging

### Sentry Integration

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  debug: false,
});
```

```javascript
// sentry.server.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  debug: false,
});
```

### Analytics Integration

```typescript
// lib/analytics.ts
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
  }
};

export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
```

### Health Check Endpoint

```typescript
// app/api/health/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check database connection
    // Check external services
    
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "unhealthy", error: error.message },
      { status: 503 }
    );
  }
}
```

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**🎉 Congratulations! You've completed the standardization documentation.**
