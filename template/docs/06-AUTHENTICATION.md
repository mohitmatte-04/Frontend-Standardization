# 🔐 Authentication Guide

Complete guide for implementing secure authentication in Next.js applications using NextAuth.js.

## Table of Contents

- [Overview](#overview)
- [NextAuth.js Setup](#nextauthjs-setup)
- [Authentication Providers](#authentication-providers)
- [Session Management](#session-management)
- [Protected Routes](#protected-routes)
- [Role-Based Access Control](#role-based-access-control)
- [API Authentication](#api-authentication)
- [Best Practices](#best-practices)

## Overview

We use **NextAuth.js v5 (Auth.js)** as our authentication solution because it provides:

- ✅ Multiple authentication providers (OAuth, Credentials, Email)
- ✅ Built-in session management
- ✅ JWT and database session support
- ✅ TypeScript support
- ✅ Edge runtime compatible
- ✅ Automatic CSRF protection

### Authentication Flow

```
┌─────────┐      ┌──────────┐      ┌─────────┐      ┌──────────┐
│  User   │─────▶│  Login   │─────▶│NextAuth │─────▶│ Provider │
│ Browser │      │   Page   │      │  API    │      │  (OAuth) │
└─────────┘      └──────────┘      └─────────┘      └──────────┘
     ▲                                    │
     │                                    ▼
     │                              ┌─────────┐
     └──────────────────────────────│ Session │
                                    │  Token  │
                                    └─────────┘
```

## NextAuth.js Setup

### 1. Installation

```bash
npm install next-auth@beta
npm install @auth/core
npm install bcryptjs
npm install -D @types/bcryptjs
```

### 2. Environment Variables

Create or update `.env.local`:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here-min-32-chars

# Database (if using database sessions)
DATABASE_URL=postgresql://user:password@localhost:5432/mydb

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Email Provider (optional)
EMAIL_SERVER=smtp://user:password@smtp.example.com:587
EMAIL_FROM=noreply@example.com
```

**Generate a secure secret:**

```bash
openssl rand -base64 32
```

### 3. Auth Configuration

Create `src/lib/auth/auth.config.ts`:

```typescript
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/lib/validators/auth.schema";
import { getUserByEmail } from "@/lib/api/users";
import bcrypt from "bcryptjs";

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;
        
        const user = await getUserByEmail(email);
        if (!user || !user.password) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      if (trigger === "update" && session) {
        token = { ...token, ...session.user };
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      
      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
```

### 4. Auth Route Handler

Create `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
```

### 5. Type Definitions

Create `src/types/auth.types.ts`:

```typescript
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}
```

### 6. Validation Schemas

Create `src/lib/validators/auth.schema.ts`:

```typescript
import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters",
    }),
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
```

## Authentication Providers

### Google OAuth

```typescript
// Already configured in auth.config.ts
Google({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  authorization: {
    params: {
      prompt: "consent",
      access_type: "offline",
      response_type: "code",
    },
  },
})
```

**Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

### GitHub OAuth

```typescript
GitHub({
  clientId: process.env.GITHUB_ID,
  clientSecret: process.env.GITHUB_SECRET,
})
```

**Setup:**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Homepage URL: `http://localhost:3000`
4. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

### Email & Password (Credentials)

Create `src/app/api/auth/register/route.ts`:

```typescript
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validators/auth.schema";
import { createUser, getUserByEmail } from "@/lib/api/users";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedFields = registerSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid fields", details: validatedFields.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password } = validatedFields.data;

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await createUser({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: { id: user.id, email: user.email, name: user.name },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

## Session Management

### Server Component

```typescript
import { auth } from "@/lib/auth/auth";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <p>Email: {session.user.email}</p>
      <p>Role: {session.user.role}</p>
    </div>
  );
}
```

### Client Component

```typescript
"use client";

import { useSession } from "next-auth/react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export function UserProfile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (status === "unauthenticated") {
    return <p>Please sign in</p>;
  }

  return (
    <div>
      <h2>Welcome, {session?.user?.name}</h2>
      <p>{session?.user?.email}</p>
    </div>
  );
}
```

### Session Provider

Wrap your app with SessionProvider in `src/app/layout.tsx`:

```typescript
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
```

## Protected Routes

### Middleware Protection

Create `src/middleware.ts`:

```typescript
import { auth } from "@/lib/auth/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Protected routes
  const protectedRoutes = ["/dashboard", "/profile", "/settings"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect unauthenticated users
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from auth pages
  const authRoutes = ["/login", "/register"];
  if (authRoutes.includes(pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

### Component-Level Protection

```typescript
// components/auth/ProtectedRoute.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (
      requiredRole &&
      session?.user?.role &&
      session.user.role !== requiredRole
    ) {
      router.push("/unauthorized");
    }
  }, [status, session, requiredRole, router]);

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
}

// Usage
<ProtectedRoute requiredRole="admin">
  <AdminDashboard />
</ProtectedRoute>
```

## Role-Based Access Control

### Define Roles

```typescript
// lib/auth/roles.ts
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  MODERATOR = "moderator",
}

export const roleHierarchy = {
  [UserRole.ADMIN]: 3,
  [UserRole.MODERATOR]: 2,
  [UserRole.USER]: 1,
};

export function hasPermission(userRole: string, requiredRole: string): boolean {
  return roleHierarchy[userRole as UserRole] >= roleHierarchy[requiredRole as UserRole];
}
```

### Permission Hooks

```typescript
// hooks/usePermission.ts
import { useSession } from "next-auth/react";
import { hasPermission } from "@/lib/auth/roles";

export function usePermission(requiredRole: string) {
  const { data: session } = useSession();
  
  if (!session?.user?.role) {
    return false;
  }

  return hasPermission(session.user.role, requiredRole);
}

// Usage
function AdminButton() {
  const canAccess = usePermission(UserRole.ADMIN);

  if (!canAccess) return null;

  return <Button>Admin Action</Button>;
}
```

### Server-Side Permission Check

```typescript
// lib/auth/permissions.ts
import { auth } from "@/lib/auth/auth";
import { hasPermission } from "./roles";

export async function checkPermission(requiredRole: string) {
  const session = await auth();

  if (!session?.user?.role) {
    throw new Error("Unauthorized");
  }

  if (!hasPermission(session.user.role, requiredRole)) {
    throw new Error("Insufficient permissions");
  }

  return true;
}

// Usage in API route
export async function DELETE(req: Request) {
  await checkPermission(UserRole.ADMIN);
  
  // Proceed with deletion
}
```

## API Authentication

### Protected API Routes

```typescript
// app/api/users/route.ts
import { auth } from "@/lib/auth/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Return user data
  return NextResponse.json({ users: [] });
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session || session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  // Create user
  const body = await req.json();
  // ...
}
```

### API Client with Auth

```typescript
// lib/api/client.ts
import axios from "axios";
import { getSession } from "next-auth/react";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

## Best Practices

### 1. Password Security

```typescript
// Strong password requirements
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[0-9]/, "Password must contain a number")
  .regex(/[^A-Za-z0-9]/, "Password must contain a special character");

// Use bcrypt with appropriate rounds
const hashedPassword = await bcrypt.hash(password, 12); // 12 rounds minimum
```

### 2. Rate Limiting

```typescript
// lib/auth/rate-limit.ts
import { LRUCache } from "lru-cache";

const ratelimit = new LRUCache({
  max: 500,
  ttl: 60000, // 1 minute
});

export async function rateLimit(identifier: string) {
  const tokenCount = (ratelimit.get(identifier) as number[]) || [0];
  
  if (tokenCount[0] === 0) {
    ratelimit.set(identifier, [1]);
  } else {
    tokenCount[0] += 1;
    ratelimit.set(identifier, tokenCount);
    
    if (tokenCount[0] > 5) {
      throw new Error("Too many requests");
    }
  }
}

// Usage in login route
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  await rateLimit(ip);
  
  // Proceed with login
}
```

### 3. Secure Session Storage

```typescript
// Use secure cookies
session: {
  strategy: "jwt",
  maxAge: 30 * 24 * 60 * 60,
},
cookies: {
  sessionToken: {
    name: `__Secure-next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    },
  },
},
```

### 4. CSRF Protection

NextAuth.js includes built-in CSRF protection, but also:

```typescript
// Add CSRF token to forms
import { getCsrfToken } from "next-auth/react";

export async function LoginForm() {
  const csrfToken = await getCsrfToken();

  return (
    <form method="post" action="/api/auth/callback/credentials">
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      {/* Other fields */}
    </form>
  );
}
```

### 5. Logout Handling

```typescript
"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <Button onClick={handleLogout} variant="outline">
      Sign Out
    </Button>
  );
}
```

### 6. Email Verification

```typescript
// Generate verification token
import crypto from "crypto";

export async function generateVerificationToken(email: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return token;
}

// Verify token
export async function verifyEmail(token: string) {
  const verificationToken = await db.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    throw new Error("Invalid token");
  }

  if (new Date() > verificationToken.expires) {
    throw new Error("Token expired");
  }

  await db.user.update({
    where: { email: verificationToken.email },
    data: { emailVerified: new Date() },
  });

  await db.verificationToken.delete({
    where: { token },
  });
}
```

## Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Auth.js Documentation](https://authjs.dev/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**Next:** [Security Guide](./SECURITY.md) →
