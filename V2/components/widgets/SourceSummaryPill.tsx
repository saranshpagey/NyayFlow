import React from 'react';
import { Book } from 'iconoir-react';

export const SourceSummaryPill = ({ count, onClick }: { count: number, onClick: () => void }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-3 px-4 py-2 bg-zinc-100/80 dark:bg-zinc-900/80 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-800/50 rounded-full transition-all active:scale-95 group"
    >
        <div className="flex -space-x-2">
            {[1, 2, 3].slice(0, Math.min(count, 3)).map((i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-white dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-900 flex items-center justify-center shadow-sm">
                    <Book className="w-3 h-3 text-zinc-400" />
                </div>
            ))}
        </div>
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {count} {count === 1 ? 'source' : 'sources'}
        </span>
    </button>
);
