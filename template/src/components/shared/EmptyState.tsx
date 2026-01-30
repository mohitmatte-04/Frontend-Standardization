import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
    title: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
    icon?: React.ReactNode;
}

export function EmptyState({
    title,
    description,
    actionLabel,
    actionHref,
    icon,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
            <h3 className="mb-2 text-lg font-semibold">{title}</h3>
            {description && (
                <p className="mb-4 text-sm text-muted-foreground">{description}</p>
            )}
            {actionLabel && actionHref && (
                <Button asChild>
                    <Link href={actionHref}>{actionLabel}</Link>
                </Button>
            )}
        </div>
    );
}
