import React from 'react';
import { ResearchResult } from '../../lib/types';

export const SourceChip = ({ item, index, onClick }: { item: ResearchResult, index: number, onClick: () => void }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-blue-500 transition-all text-xs font-medium text-zinc-600 dark:text-zinc-400 whitespace-nowrap active:scale-95 group"
    >
        <span className="w-5 h-5 flex items-center justify-center bg-zinc-200 dark:bg-zinc-800 rounded-md text-xs font-medium text-zinc-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            {index + 1}
        </span>
        <span className="max-w-[150px] truncate">{item.title}</span>
    </button>
);
