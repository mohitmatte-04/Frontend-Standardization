# 🎨 Component Guidelines

Complete guide for using shadcn/ui and DaisyUI components in your Next.js application.

## Table of Contents

- [Overview](#overview)
- [shadcn/ui Components](#shadcnui-components)
- [DaisyUI Components](#daisyui-components)
- [Custom Component Development](#custom-component-development)
- [Component Patterns](#component-patterns)
- [Styling Guidelines](#styling-guidelines)
- [Accessibility](#accessibility)
- [Best Practices](#best-practices)

## Overview

We use a hybrid approach combining two powerful component libraries:

| Library | Purpose | When to Use |
|---------|---------|-------------|
| **shadcn/ui** | Primary UI library | Complex, interactive components with full customization |
| **DaisyUI** | Rapid prototyping | Quick layouts, semantic HTML components |
| **Custom** | Unique requirements | Business-specific components not covered by libraries |

### Philosophy

- 🎯 **shadcn/ui First** - Use for core interactive components
- ⚡ **DaisyUI for Speed** - Use for rapid prototyping and semantic HTML
- 🔧 **Custom When Needed** - Build custom only when libraries don't fit
- ♿ **Accessibility Always** - Ensure all components are accessible

## shadcn/ui Components

### Installation

shadcn/ui components are installed individually and added to your project:

```bash
# Install a component
npx shadcn-ui@latest add button

# Install multiple components
npx shadcn-ui@latest add button card input dialog
```

### Core Components

#### Button Component

```typescript
import { Button } from "@/components/ui/button";

export function ButtonDemo() {
  return (
    <div className="flex gap-4">
      {/* Variants */}
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>

      {/* Sizes */}
      <Button size="default">Default</Button>
      <Button size="sm">Small</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <span>🚀</span>
      </Button>

      {/* States */}
      <Button disabled>Disabled</Button>
      <Button loading>Loading...</Button>
    </div>
  );
}
```

#### Card Component

```typescript
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CardDemo() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            {/* Form fields */}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  );
}
```

#### Dialog Component

```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

#### Form Component with React Hook Form

```typescript
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

#### Table Component

```typescript
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const invoices = [
  { invoice: "INV001", status: "Paid", amount: "$250.00" },
  { invoice: "INV002", status: "Pending", amount: "$150.00" },
  // ...
];

export function TableDemo() {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell className="text-right">{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

#### Dropdown Menu

```typescript
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function DropdownMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### Essential shadcn/ui Components

Install these components for most projects:

```bash
# Core UI components
npx shadcn-ui@latest add button input label textarea
npx shadcn-ui@latest add card dialog sheet
npx shadcn-ui@latest add dropdown-menu select
npx shadcn-ui@latest add form checkbox radio-group switch
npx shadcn-ui@latest add table tabs
npx shadcn-ui@latest add toast avatar badge
npx shadcn-ui@latest add alert progress skeleton
npx shadcn-ui@latest add separator scroll-area
```

### Customizing shadcn/ui Components

shadcn/ui components are copied to your project, so you can customize them:

```typescript
// components/ui/button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        // Add custom variant
        gradient: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
        // Add custom size
        xl: "h-14 px-10 text-lg rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

## DaisyUI Components

### Configuration

DaisyUI is configured in `tailwind.config.ts`:

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
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      {
        mytheme: {
          primary: "#570df8",
          secondary: "#f000b8",
          accent: "#37cdbe",
          neutral: "#3d4451",
          "base-100": "#ffffff",
        },
      },
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    rtl: false,
    prefix: "",
    logs: true,
  },
};

export default config;
```

### Common DaisyUI Components

#### Hero Section

```tsx
export function Hero() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hello there</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi.
          </p>
          <button className="btn btn-primary">Get Started</button>
        </div>
      </div>
    </div>
  );
}
```

#### Card

```tsx
export function DaisyCard() {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure>
        <img src="/images/stock/photo.jpg" alt="Shoes" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          Shoes!
          <div className="badge badge-secondary">NEW</div>
        </h2>
        <p>If a dog chews shoes whose shoes does he choose?</p>
        <div className="card-actions justify-end">
          <div className="badge badge-outline">Fashion</div>
          <div className="badge badge-outline">Products</div>
        </div>
      </div>
    </div>
  );
}
```

#### Modal

```tsx
export function ModalDemo() {
  return (
    <>
      <button className="btn" onClick={() => window.my_modal_5.showModal()}>
        Open Modal
      </button>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click the button below to close</p>
          <div className="modal-action">
            <button className="btn">Close</button>
          </div>
        </form>
      </dialog>
    </>
  );
}
```

#### Navbar

```tsx
export function Navbar() {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">daisyUI</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li><a>Link</a></li>
          <li>
            <details>
              <summary>Parent</summary>
              <ul className="p-2 bg-base-100">
                <li><a>Link 1</a></li>
                <li><a>Link 2</a></li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  );
}
```

### When to Use DaisyUI

✅ **Use DaisyUI for:**
- Landing pages and marketing pages
- Admin dashboards with semantic HTML
- Rapid prototyping
- Simple layouts (hero, footer, navbar)
- Badges, alerts, stats displays

❌ **Don't use DaisyUI for:**
- Complex form controls (use shadcn/ui)
- Highly interactive components
- Components requiring custom logic
- Components needing TypeScript props

## Custom Component Development

### Component Template

```typescript
// components/shared/CustomComponent.tsx
import { cn } from "@/lib/utils";

interface CustomComponentProps {
  /** Component title */
  title: string;
  /** Component description */
  description?: string;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Child elements */
  children?: React.ReactNode;
}

export function CustomComponent({
  title,
  description,
  onClick,
  className,
  children,
}: CustomComponentProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-6 shadow-sm",
        onClick && "cursor-pointer hover:shadow-md transition-shadow",
        className
      )}
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
```

### Compound Components Pattern

```typescript
// components/shared/Card/Card.tsx
interface CardCompou

ndProps {
  children: React.ReactNode;
  className?: string;
}

function CardRoot({ children, className }: CardCompoundProps) {
  return (
    <div className={cn("rounded-lg border bg-card shadow-sm", className)}>
      {children}
    </div>
  );
}

function CardHeader({ children, className }: CardCompoundProps) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)}>
      {children}
    </div>
  );
}

function CardTitle({ children, className }: CardCompoundProps) {
  return (
    <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)}>
      {children}
    </h3>
  );
}

function CardContent({ children, className }: CardCompoundProps) {
  return <div className={cn("p-6 pt-0", className)}>{children}</div>;
}

// Export as compound component
export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Content: CardContent,
};

// Usage
<Card.Root>
  <Card.Header>
    <Card.Title>Title</Card.Title>
  </Card.Header>
  <Card.Content>Content</Card.Content>
</Card.Root>
```

## Component Patterns

### Container/Presenter Pattern

**Container Component (Smart):**
```typescript
// components/features/user/UserProfileContainer.tsx
import { useUser } from "@/hooks/useUser";
import { UserProfilePresenter } from "./UserProfilePresenter";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

interface UserProfileContainerProps {
  userId: string;
}

export function UserProfileContainer({ userId }: UserProfileContainerProps) {
  const { data, isLoading, error } = useUser(userId);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return null;

  return <UserProfilePresenter user={data} />;
}
```

**Presenter Component (Dumb):**
```typescript
// components/features/user/UserProfilePresenter.tsx
import { User } from "@/types/user.types";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

interface UserProfilePresenterProps {
  user: User;
}

export function UserProfilePresenter({ user }: UserProfilePresenterProps) {
  return (
    <Card>
      <Avatar src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </Card>
  );
}
```

### Composition Pattern

```typescript
interface PageProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Page({ header, sidebar, children, footer }: PageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {header && <header className="border-b">{header}</header>}
      <div className="flex-1 flex">
        {sidebar && <aside className="w-64 border-r">{sidebar}</aside>}
        <main className="flex-1 p-6">{children}</main>
      </div>
      {footer && <footer className="border-t">{footer}</footer>}
    </div>
  );
}

// Usage
<Page
  header={<Header />}
  sidebar={<Sidebar />}
  footer={<Footer />}
>
  <h1>Page Content</h1>
</Page>
```

## Styling Guidelines

### Using Tailwind CSS

```typescript
// ✅ Good: Using Tailwind classes
<div className="flex items-center gap-4 rounded-lg bg-slate-100 p-4">
  <span className="text-lg font-semibold">Title</span>
</div>

// ❌ Bad: Inline styles
<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
  <span style={{ fontSize: '1.125rem', fontWeight: 600 }}>Title</span>
</div>
```

### Using cn() Utility

```typescript
import { cn } from "@/lib/utils/cn";

interface ButtonProps {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Button({ variant = "primary", size = "md", className }: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        "rounded font-medium transition-colors",
        // Variant styles
        variant === "primary" && "bg-blue-500 text-white hover:bg-blue-600",
        variant === "secondary" && "bg-gray-200 text-gray-900 hover:bg-gray-300",
        // Size styles
        size === "sm" && "px-3 py-1 text-sm",
        size === "md" && "px-4 py-2 text-base",
        size === "lg" && "px-6 py-3 text-lg",
        // Custom classes
        className
      )}
    />
  );
}
```

## Accessibility

### ARIA Attributes

```typescript
<button
  aria-label="Close dialog"
  aria-pressed={isPressed}
  aria-expanded={isExpanded}
  aria-controls="menu-id"
  aria-describedby="description-id"
>
  Close
</button>
```

### Keyboard Navigation

```typescript
function Dialog({ isOpen, onClose }: DialogProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  return (
    // Dialog implementation
  );
}
```

### Focus Management

```typescript
import { useRef, useEffect } from "react";

function Modal({ isOpen }: ModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <dialog open={isOpen}>
      <button ref={closeButtonRef}>Close</button>
    </dialog>
  );
}
```

## Best Practices

### 1. Always Define Prop Types

```typescript
// ✅ Good
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  className?: string;
}

export function UserCard({ user, onEdit, className }: UserCardProps) {
  // ...
}

// ❌ Bad
export function UserCard(props: any) {
  // ...
}
```

### 2. Extract Reusable Logic

```typescript
// ✅ Good: Custom hook
function useToggle(initialState = false) {
  const [state, setState] = useState(initialState);
  const toggle = () => setState((prev) => !prev);
  return [state, toggle] as const;
}

export function Component() {
  const [isOpen, toggleOpen] = useToggle();
  return <button onClick={toggleOpen}>Toggle</button>;
}
```

### 3. Use Composition Over Props

```typescript
// ✅ Good: Composition
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// ❌ Bad: Too many props
<Card 
  title="Title"
  content="Content"
  hasHeader={true}
  headerStyle="bold"
/>
```

### 4. Memoize Expensive Components

```typescript
import { memo } from "react";

export const ExpensiveComponent = memo(function ExpensiveComponent({ data }: Props) {
  // Expensive rendering logic
  return <div>{/* ... */}</div>;
});
```

### 5. Handle Loading and Error States

```typescript
export function UserProfile({ userId }: UserProfileProps) {
  const { data, isLoading, error } = useUser(userId);

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return <EmptyState message="User not found" />;
  }

  return <div>{/* User profile */}</div>;
}
```

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [DaisyUI Documentation](https://daisyui.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Patterns](https://reactpatterns.com/)

---

**Next:** [Authentication Guide](./AUTHENTICATION.md) →
