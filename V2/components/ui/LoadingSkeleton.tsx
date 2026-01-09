import React from 'react';
import { cn } from '../../lib/utils';

interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    count?: number; // Number of skeleton lines
    circle?: boolean;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
    className,
    count = 1,
    circle = false,
    ...props
}) => {
    return (
        <div className={cn("space-y-2 animate-pulse", className)} {...props} aria-hidden="true">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "bg-zinc-200 dark:bg-zinc-800 rounded-md",
                        circle ? "rounded-full" : "rounded-md",
                        // Allow height/width to be passed via className, or default
                        !className?.includes('h-') && "h-4",
                        !className?.includes('w-') && "w-full"
                    )}
                />
            ))}
            <span className="sr-only">Loading content...</span>
        </div>
    );
};

export default LoadingSkeleton;
