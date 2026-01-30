# ✅ Testing Guide

Comprehensive testing strategy and implementation guide for Next.js applications.

## Table of Contents

- [Testing Overview](#testing-overview)
- [Testing Setup](#testing-setup)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Testing Best Practices](#testing-best-practices)
- [Coverage Requirements](#coverage-requirements)

## Testing Overview

### Testing Pyramid

```
        /\
       /  \
      / E2E\     ← Few, slow, expensive
     /______\
    /        \
   /Integration\ ← Some, medium speed
  /____________\
 /              \
/  Unit Tests    \ ← Many, fast, cheap
/__________________\
```

### Testing Stack

| Type | Tools | Purpose |
|------|-------|---------|
| **Unit** | Jest + React Testing Library | Test individual components and functions |
| **Integration** | Jest + MSW | Test component interactions and API calls |
| **E2E** | Playwright | Test complete user flows |
| **Visual** | Chromatic (optional) | Visual regression testing |

## Testing Setup

### Installation

```bash
# Core testing libraries
npm install -D jest @types/jest jest-environment-jsdom
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event

# Next.js testing utilities
npm install -D @testing-library/react-hooks

# Mock Service Worker (API mocking)
npm install -D msw

# Playwright for E2E
npm install -D @playwright/test
```

### Jest Configuration

Create `jest.config.js`:

```javascript
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/tests/setup/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{js,jsx,ts,tsx}",
    "!src/**/__tests__/**",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testMatch: [
    "<rootDir>/tests/**/*.test.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
  ],
};

module.exports = createJestConfig(customJestConfig);
```

### Jest Setup File

Create `tests/setup/jest.setup.ts`:

```typescript
import "@testing-library/jest-dom";
import { server } from "../mocks/server";

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests
afterEach(() => server.resetHandlers());

// Clean up after tests are finished
afterAll(() => server.close());

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  usePathname() {
    return "/";
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

### MSW Setup (API Mocking)

Create `tests/mocks/handlers.ts`:

```typescript
import { http, HttpResponse } from "msw";

export const handlers = [
  // Mock user API
  http.get("/api/users/:id", ({ params }) => {
    const { id } = params;
    
    return HttpResponse.json({
      id,
      name: "John Doe",
      email: "john@example.com",
    });
  }),

  // Mock login API
  http.post("/api/auth/login", async ({ request }) => {
    const body = await request.json();
    
    if (body.email === "test@example.com") {
      return HttpResponse.json({
        user: {
          id: "1",
          email: "test@example.com",
          name: "Test User",
        },
        token: "fake-jwt-token",
      });
    }

    return HttpResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }),
];
```

Create `tests/mocks/server.ts`:

```typescript
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
```

### Playwright Configuration

Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    // Mobile viewports
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

## Unit Testing

### Testing Components

```typescript
// components/Button.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders with label", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Click me</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("renders with different variants", () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn-primary");

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn-secondary");
  });
});
```

### Testing Hooks

```typescript
// hooks/useCounter.test.ts
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";

describe("useCounter", () => {
  it("initializes with default value", () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it("initializes with custom value", () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it("increments counter", () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });

  it("decrements counter", () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(4);
  });

  it("resets counter", () => {
    const { result } = renderHook(() => useCounter(10));
    
    act(() => {
      result.current.increment();
      result.current.reset();
    });
    
    expect(result.current.count).toBe(10);
  });
});
```

### Testing Utilities

```typescript
// lib/utils/format.test.ts
import { formatCurrency, formatDate, truncate } from "./format";

describe("formatCurrency", () => {
  it("formats number as USD currency", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });

  it("handles zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("handles negative numbers", () => {
    expect(formatCurrency(-100)).toBe("-$100.00");
  });
});

describe("formatDate", () => {
  it("formats date correctly", () => {
    const date = new Date("2024-01-15");
    expect(formatDate(date)).toBe("January 15, 2024");
  });

  it("handles invalid date", () => {
    expect(() => formatDate(new Date("invalid"))).toThrow();
  });
});

describe("truncate", () => {
  it("truncates long strings", () => {
    const longString = "This is a very long string that should be truncated";
    expect(truncate(longString, 20)).toBe("This is a very long...");
  });

  it("does not truncate short strings", () => {
    const shortString = "Short";
    expect(truncate(shortString, 20)).toBe("Short");
  });
});
```

## Integration Testing

### Testing Forms

```typescript
// components/LoginForm.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./LoginForm";

describe("LoginForm", () => {
  it("submits form with valid credentials", async () => {
    const onSuccess = jest.fn();
    render(<LoginForm onSuccess={onSuccess} />);

    await userEvent.type(
      screen.getByLabelText(/email/i),
      "test@example.com"
    );
    await userEvent.type(
      screen.getByLabelText(/password/i),
      "password123"
    );

    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith({
        user: expect.objectContaining({
          email: "test@example.com",
        }),
      });
    });
  });

  it("shows validation errors for empty fields", async () => {
    render(<LoginForm />);

    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it("shows error message for invalid credentials", async () => {
    render(<LoginForm />);

    await userEvent.type(
      screen.getByLabelText(/email/i),
      "wrong@example.com"
    );
    await userEvent.type(
      screen.getByLabelText(/password/i),
      "wrongpassword"
    );

    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByText(/invalid credentials/i)
    ).toBeInTheDocument();
  });

  it("disables submit button while loading", async () => {
    render(<LoginForm />);

    await userEvent.type(
      screen.getByLabelText(/email/i),
      "test@example.com"
    );
    await userEvent.type(
      screen.getByLabelText(/password/i),
      "password123"
    );

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    await userEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
  });
});
```

### Testing API Routes

```typescript
// app/api/users/route.test.ts
import { GET, POST } from "./route";
import { NextRequest } from "next/server";

describe("/api/users", () => {
  describe("GET", () => {
    it("returns list of users", async () => {
      const request = new NextRequest("http://localhost:3000/api/users");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.users).toBeInstanceOf(Array);
    });

    it("requires authentication", async () => {
      const request = new NextRequest("http://localhost:3000/api/users");
      // Mock unauthenticated request
      const response = await GET(request);

      expect(response.status).toBe(401);
    });
  });

  describe("POST", () => {
    it("creates new user", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
      };

      const request = new NextRequest("http://localhost:3000/api/users", {
        method: "POST",
        body: JSON.stringify(userData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.user).toMatchObject(userData);
    });

    it("validates required fields", async () => {
      const request = new NextRequest("http://localhost:3000/api/users", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });
  });
});
```

## End-to-End Testing

### Basic E2E Test

```typescript
// tests/e2e/login.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Login Flow", () => {
  test("successful login redirects to dashboard", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByText("Welcome back")).toBeVisible();
  });

  test("invalid credentials show error", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="email"]', "wrong@example.com");
    await page.fill('input[name="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    await expect(page.getByText("Invalid credentials")).toBeVisible();
    await expect(page).toHaveURL("/login");
  });

  test("shows validation errors", async ({ page }) => {
    await page.goto("/login");

    await page.click('button[type="submit"]');

    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();
  });
});
```

### Advanced E2E Test

```typescript
// tests/e2e/user-management.spec.ts
import { test, expect } from "@playwright/test";

test.describe("User Management", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/login");
    await page.fill('input[name="email"]', "admin@example.com");
    await page.fill('input[name="password"]', "admin123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/dashboard");
  });

  test("admin can create new user", async ({ page }) => {
    await page.goto("/users");
    await page.click('button:text("Add User")');

    await page.fill('input[name="name"]', "New User");
    await page.fill('input[name="email"]', "newuser@example.com");
    await page.selectOption('select[name="role"]', "user");
    await page.click('button:text("Create")');

    await expect(page.getByText("User created successfully")).toBeVisible();
    await expect(page.getByText("New User")).toBeVisible();
  });

  test("admin can edit existing user", async ({ page }) => {
    await page.goto("/users");
    
    // Click edit on first user
    await page.click('button[aria-label="Edit user"]:first-child');

    await page.fill('input[name="name"]', "Updated Name");
    await page.click('button:text("Save")');

    await expect(page.getByText("User updated successfully")).toBeVisible();
    await expect(page.getByText("Updated Name")).toBeVisible();
  });

  test("admin can delete user", async ({ page }) => {
    await page.goto("/users");
    
    const userCount = await page.locator('[data-testid="user-row"]').count();

    await page.click('button[aria-label="Delete user"]:first-child');
    await page.click('button:text("Confirm")');

    await expect(page.getByText("User deleted successfully")).toBeVisible();
    
    const newUserCount = await page.locator('[data-testid="user-row"]').count();
    expect(newUserCount).toBe(userCount - 1);
  });
});
```

## Testing Best Practices

### 1. AAA Pattern

```typescript
test("increments counter", () => {
  // Arrange
  const { result } = renderHook(() => useCounter(0));

  // Act
  act(() => {
    result.current.increment();
  });

  // Assert
  expect(result.current.count).toBe(1);
});
```

### 2. Query Priority

```typescript
// ✅ Preferred queries (accessible to everyone)
screen.getByRole("button", { name: /submit/i });
screen.getByLabelText(/email/i);
screen.getByPlaceholderText(/enter email/i);
screen.getByText(/welcome/i);

// ⚠️ Use when semantic queries don't work
screen.getByDisplayValue("John");
screen.getByAltText("User avatar");
screen.getByTitle("Close");

// ❌ Last resort (not accessible-friendly)
screen.getByTestId("submit-button");
```

### 3. Async Testing

```typescript
// ✅ Good: Use waitFor for async operations
test("loads and displays data", async () => {
  render(<UserList />);

  await waitFor(() => {
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});

// ✅ Good: Use findBy queries (includes waiting)
test("loads and displays data", async () => {
  render(<UserList />);
  
  expect(await screen.findByText("John Doe")).toBeInTheDocument();
});

// ❌ Bad: Not waiting for async operations
test("loads and displays data", () => {
  render(<UserList />);
  expect(screen.getByText("John Doe")).toBeInTheDocument(); // Will fail
});
```

### 4. Don't Test Implementation Details

```typescript
// ❌ Bad: Testing internal state
test("counter state", () => {
  const { result } = renderHook(() => useCounter());
  expect(result.current.state.count).toBe(0); // Implementation detail
});

// ✅ Good: Testing behavior
test("counter displays correct value", () => {
  render(<Counter />);
  expect(screen.getByText("Count: 0")).toBeInTheDocument();
});
```

### 5. Test Error States

```typescript
test("handles error when API fails", async () => {
  // Mock API error
  server.use(
    http.get("/api/users", () => {
      return HttpResponse.error();
    })
  );

  render(<UserList />);

  expect(
    await screen.findByText(/failed to load users/i)
  ).toBeInTheDocument();
});
```

## Coverage Requirements

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

### Coverage Thresholds

```javascript
// jest.config.js
module.exports = {
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
    // Per-file thresholds
    "./src/components/**/*.tsx": {
      branches: 80,
      functions: 80,
      lines: 80,
    },
    "./src/lib/**/*.ts": {
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
};
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "20"
          cache: "npm"
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "20"
          cache: "npm"
      
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
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://testingjavascript.com/)

---

**Next:** [Deployment Guide](./DEPLOYMENT.md) →
