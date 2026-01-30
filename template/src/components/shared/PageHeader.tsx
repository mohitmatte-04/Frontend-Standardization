import { cn } from '@/lib/utils/cn';

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: React.ReactNode;
    className?: string;
}

export function PageHeader({
    title,
    description,
    actions,
    className,
}: PageHeaderProps) {
    return (
        <div
            className={cn(
                'flex items-center justify-between border-b pb-4 mb-6',
                className
            )}
        >
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                {description && (
                    <p className="mt-2 text-muted-foreground">{description}</p>
                )}
            </div>
            {actions && <div className="flex gap-2">{actions}</div>}
        </div>
    );
}
