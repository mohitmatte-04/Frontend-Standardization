export default function HomePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="text-center">
                <h1 className="mb-4 text-4xl font-bold">
                    🚀 Next.js Standardization Template
                </h1>
                <p className="mb-8 text-xl text-muted-foreground">
                    Welcome to your production-ready Next.js application!
                </p>

                <div className="flex gap-4 justify-center">
                    <a
                        href="/docs/GETTING_STARTED.md"
                        className="btn btn-primary"
                    >
                        Get Started
                    </a>
                    <a
                        href="https://github.com"
                        className="btn btn-outline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View on GitHub
                    </a>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="card bg-base-200 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">📦 Components</h2>
                            <p>shadcn/ui and DaisyUI pre-configured</p>
                        </div>
                    </div>

                    <div className="card bg-base-200 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">🔐 Authentication</h2>
                            <p>NextAuth.js ready to use</p>
                        </div>
                    </div>

                    <div className="card bg-base-200 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">✅ Best Practices</h2>
                            <p>ESLint, Prettier, Husky configured</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
