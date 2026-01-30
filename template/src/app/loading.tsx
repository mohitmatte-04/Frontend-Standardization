export default function LoadingPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <div className="loading loading-spinner loading-lg"></div>
                <p className="mt-4 text-muted-foreground">Loading...</p>
            </div>
        </div>
    );
}
