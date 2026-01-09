import React from 'react';
import { Book } from 'iconoir-react';

export const StatuteWidget = ({ data }: { data: any }) => (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                <Book className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-white">{data.title}</h3>
        </div>
        <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Detailed Breakdown</div>
        <div className="bg-zinc-50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 mb-3">
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[15px] italic">"{data.text}"</p>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed pl-1">💡 {data.explanation}</p>
    </div>
);
