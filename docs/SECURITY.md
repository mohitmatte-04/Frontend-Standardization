# 🛡️ Security Best Practices

Comprehensive security guidelines for Next.js applications.

## Table of Contents

- [Security Overview](#security-overview)
- [Environment Variables](#environment-variables)
- [Input Validation](#input-validation)
- [XSS Protection](#xss-protection)
- [CSRF Protection](#csrf-protection)
- [SQL Injection Prevention](#sql-injection-prevention)
- [Security Headers](#security-headers)
- [API Security](#api-security)
- [Data Protection](#data-protection)
- [Dependency Security](#dependency-security)
- [Security Checklist](#security-checklist)

## Security Overview

Security is not optional—it's essential. This guide covers critical security practices for Next.js applications.

### Security Principles

1. **Defense in Depth** - Multiple layers of security
2. **Least Privilege** - Minimum necessary permissions
3. **Fail Securely** - Handle errors safely
4. **Keep it Simple** - Complexity is the enemy of security
5. **Trust No One** - Validate all inputs

### OWASP Top 10 Coverage

| Vulnerability | Our Protection |
|---------------|----------------|
| Injection | Input validation, parameterized queries |
| Broken Authentication | NextAuth.js, secure sessions |
| Sensitive Data Exposure | Encryption, secure headers |
| XML External Entities | Input validation |
| Broken Access Control | RBAC, middleware protection |
| Security Misconfiguration | Secure defaults, strict CSP |
| XSS | React escaping, CSP, sanitization |
| Insecure Deserialization | Input validation, type checking |
| Using Components with Known Vulnerabilities | npm audit, Dependabot |
| Insufficient Logging & Monitoring | Structured logging, monitoring |

## Environment Variables

### Secure Storage

```bash
# .env.local (NEVER commit this file)
DATABASE_URL=postgresql://user:pass@localhost:5432/db
NEXTAUTH_SECRET=super-secret-key-min-32-characters
API_SECRET_KEY=another-secret-key

# Public variables (exposed to browser)
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_APP_NAME=MyApp
```

### Type-Safe Environment Variables

Create `src/lib/env.ts`:

```typescript
import { z } from "zod";

const envSchema = z.object({
  // Server-only variables
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  API_SECRET_KEY: z.string().min(32),
  
  // Public variables
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string(),
  
  // Node environment
  NODE_ENV: z.enum(["development", "test", "production"]),
});

const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  API_SECRET_KEY: process.env.API_SECRET_KEY,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NODE_ENV: process.env.NODE_ENV,
});

export default env;

// Usage
import env from "@/lib/env";
console.log(env.DATABASE_URL); // Type-safe and validated
```

### .gitignore Setup

```bash
# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Keep template
!.env.example
```

## Input Validation

### Zod Validation

Always validate user inputs:

```typescript
import { z } from "zod";

// Define schema
const userSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  
  email: z.string()
    .email("Invalid email address")
    .toLowerCase(),
  
  age: z.number()
    .int("Age must be an integer")
    .min(18, "Must be at least 18 years old")
    .max(120, "Invalid age"),
  
  website: z.string()
    .url("Invalid URL")
    .optional(),
  
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .optional(),
});

// API Route with validation
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = userSchema.parse(body);
    
    // Safe to use validatedData
    return NextResponse.json({ success: true, data: validatedData });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### File Upload Validation

```typescript
const fileSchema = z.object({
  name: z.string(),
  size: z.number().max(5 * 1024 * 1024, "File size must be less than 5MB"),
  type: z.enum([
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ], {
    errorMap: () => ({ message: "Invalid file type" }),
  }),
});

export async function uploadFile(file: File) {
  // Validate file
  const validation = fileSchema.safeParse({
    name: file.name,
    size: file.size,
    type: file.type,
  });

  if (!validation.success) {
    throw new Error(validation.error.errors[0].message);
  }

  // Additional checks
  const buffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(buffer);
  
  // Check magic numbers (file signatures)
  const isValidJPEG = uint8Array[0] === 0xFF && uint8Array[1] === 0xD8;
  const isValidPNG = uint8Array[0] === 0x89 && uint8Array[1] === 0x50;
  
  if (file.type.includes("image") && !isValidJPEG && !isValidPNG) {
    throw new Error("File content does not match declared type");
  }

  // Proceed with upload
}
```

## XSS Protection

### Content Security Policy (CSP)

Configure CSP in `next.config.js`:

```javascript
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://trusted-cdn.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.example.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};
```

### Sanitize User Input

```typescript
import DOMPurify from "isomorphic-dompurify";

// Sanitize HTML content
export function sanitizeHTML(dirtyHTML: string): string {
  return DOMPurify.sanitize(dirtyHTML, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
}

// Usage in component
export function UserContent({ html }: { html: string }) {
  const cleanHTML = sanitizeHTML(html);
  
  return (
    <div
      dangerouslySetInnerHTML={{ __html: cleanHTML }}
      className="user-content"
    />
  );
}
```

### Escape Output

React automatically escapes content, but be careful with:

```typescript
// ❌ DANGEROUS: Using dangerouslySetInnerHTML without sanitizing
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ SAFE: React automatically escapes
<div>{userInput}</div>

// ✅ SAFE: Sanitized HTML
<div dangerouslySetInnerHTML={{ __html: sanitizeHTML(userInput) }} />
```

## CSRF Protection

### NextAuth.js CSRF Protection

NextAuth.js includes built-in CSRF protection:

```typescript
// Automatically included in forms
import { getCsrfToken } from "next-auth/react";

export default async function SignIn() {
  const csrfToken = await getCsrfToken();
  
  return (
    <form method="post" action="/api/auth/callback/credentials">
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      {/* Other inputs */}
    </form>
  );
}
```

### Custom CSRF Protection

```typescript
// lib/csrf.ts
import { randomBytes } from "crypto";

export function generateCSRFToken(): string {
  return randomBytes(32).toString("hex");
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken;
}

// Middleware
export async function csrfMiddleware(req: Request) {
  const csrfToken = req.headers.get("X-CSRF-Token");
  const sessionToken = req.headers.get("X-Session-Token");

  if (!csrfToken || !sessionToken) {
    throw new Error("Missing CSRF token");
  }

  if (csrfToken !== sessionToken) {
    throw new Error("Invalid CSRF token");
  }
}
```

## SQL Injection Prevention

### Use Parameterized Queries

```typescript
// ❌ DANGEROUS: String concatenation
const query = `SELECT * FROM users WHERE email = '${userEmail}'`;

// ✅ SAFE: Parameterized query (Prisma)
const user = await prisma.user.findUnique({
  where: { email: userEmail },
});

// ✅ SAFE: Parameterized query (Raw SQL with Prisma)
const users = await prisma.$queryRaw`
  SELECT * FROM users WHERE email = ${userEmail}
`;

// ✅ SAFE: Parameterized query (pg library)
const result = await pool.query(
  "SELECT * FROM users WHERE email = $1",
  [userEmail]
);
```

### Input Validation for Database Queries

```typescript
const searchSchema = z.object({
  query: z.string()
    .min(1)
    .max(100)
    .regex(/^[a-zA-Z0-9\s]+$/, "Only alphanumeric characters allowed"),
  limit: z.number().int().min(1).max(100).default(10),
  offset: z.number().int().min(0).default(0),
});

export async function searchUsers(params: unknown) {
  const validated = searchSchema.parse(params);
  
  return await prisma.user.findMany({
    where: {
      name: {
        contains: validated.query,
        mode: "insensitive",
      },
    },
    take: validated.limit,
    skip: validated.offset,
  });
}
```

## Security Headers

### Complete Security Headers Configuration

```javascript
// next.config.js
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};
```

### Using next-safe Package

```bash
npm install next-safe
```

```javascript
// next.config.js
const { createSecureHeaders } = require("next-safe");

const isDev = process.env.NODE_ENV !== "production";

module.exports = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: createSecureHeaders({
          contentSecurityPolicy: {
            directives: {
              defaultSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              scriptSrc: ["'self'", isDev && "'unsafe-eval'"].filter(Boolean),
            },
          },
          forceHTTPSRedirect: [true, { maxAge: 63072000, includeSubDomains: true }],
          referrerPolicy: "same-origin",
        }),
      },
    ];
  },
};
```

## API Security

### Rate Limiting

```typescript
// lib/rate-limit.ts
import { LRUCache } from "lru-cache";

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  });

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, [1]);
          resolve();
        } else {
          tokenCount[0] += 1;
          tokenCache.set(token, tokenCount);
          const currentUsage = tokenCount[0];
          const isRateLimited = currentUsage >= limit;
          isRateLimited ? reject() : resolve();
        }
      }),
  };
}

// Usage in API route
const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500,
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

  try {
    await limiter.check(10, ip); // 10 requests per minute
  } catch {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429 }
    );
  }

  // Process request
}
```

### API Key Authentication

```typescript
// lib/api-key.ts
import crypto from "crypto";

export function generateAPIKey(): string {
  return `sk_${crypto.randomBytes(32).toString("hex")}`;
}

export async function validateAPIKey(apiKey: string): Promise<boolean> {
  // Get hashed key from database
  const hashedKey = await db.apiKey.findUnique({
    where: { key: hashAPIKey(apiKey) },
  });

  return !!hashedKey && hashedKey.active;
}

function hashAPIKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

// Middleware
export async function apiKeyMiddleware(req: Request) {
  const apiKey = req.headers.get("X-API-Key");

  if (!apiKey) {
    throw new Error("API key required");
  }

  const isValid = await validateAPIKey(apiKey);

  if (!isValid) {
    throw new Error("Invalid API key");
  }
}
```

### Request Size Limiting

```javascript
// next.config.js
module.exports = {
  api: {
    bodyParser: {
      sizeLimit: "1mb", // Set request size limit
    },
  },
};
```

## Data Protection

### Encryption

```typescript
// lib/encryption.ts
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "hex"); // 32 bytes
const IV_LENGTH = 16;

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

export function decrypt(encryptedData: string): string {
  const parts = encryptedData.split(":");
  const iv = Buffer.from(parts[0], "hex");
  const authTag = Buffer.from(parts[1], "hex");
  const encrypted = parts[2];
  
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  
  return decrypted;
}

// Usage
const sensitiveData = "user@example.com";
const encrypted = encrypt(sensitiveData);
const decrypted = decrypt(encrypted);
```

### Password Hashing

```typescript
import bcrypt from "bcryptjs";

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12); // 12 rounds minimum
  return bcrypt.hash(password, salt);
}

// Verify password
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Usage
const password = "user-password";
const hashed = await hashPassword(password);
const isValid = await verifyPassword(password, hashed);
```

### Secure Token Generation

```typescript
import crypto from "crypto";

export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

export function generateUUID(): string {
  return crypto.randomUUID();
}

// For reset tokens, verification tokens, etc.
export async function createResetToken(userId: string) {
  const token = generateSecureToken();
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const expires = new Date(Date.now() + 3600000); // 1 hour

  await db.resetToken.create({
    data: {
      userId,
      token: hashedToken,
      expires,
    },
  });

  return token; // Send this to user
}
```

## Dependency Security

### npm audit

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Fix including breaking changes
npm audit fix --force
```

### Dependabot Configuration

Create `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "your-team"
    assignees:
      - "security-team"
    labels:
      - "dependencies"
      - "security"
```

### Security Scanning

```yaml
# .github/workflows/security.yml
name: Security Scan

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  schedule:
    - cron: "0 0 * * 0" # Weekly

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run npm audit
        run: npm audit --audit-level=high
      
      - name: Run Snyk Security Scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

## Security Checklist

### Development

- [ ] All environment variables are properly secured
- [ ] Input validation on all user inputs
- [ ] Output escaping where necessary
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection implemented
- [ ] CSRF protection enabled
- [ ] Rate limiting on API endpoints
- [ ] Proper error handling (don't leak sensitive info)
- [ ] Secure session management
- [ ] Password hashing with bcrypt (12+ rounds)
- [ ] File upload validation
- [ ] Dependency scanning enabled

### Production

- [ ] HTTPS enabled (SSL/TLS)
- [ ] Security headers configured
- [ ] CSP properly configured
- [ ] Database credentials secured
- [ ] API keys rotated regularly
- [ ] Logging and monitoring enabled
- [ ] Regular security audits
- [ ] Backup and recovery plan
- [ ] Incident response plan
- [ ] Third-party service security reviewed

### Deployment

- [ ] Environment variables set in production
- [ ] Debug mode disabled
- [ ] Source maps disabled or secured
- [ ] Error messages don't reveal sensitive info
- [ ] Unnecessary dependencies removed
- [ ] Production build optimized
- [ ] Security headers verified
- [ ] SSL/TLS certificate valid

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Web Security Academy](https://portswigger.net/web-security)

---

**Next:** [Code Standards](./CODE_STANDARDS.md) →
