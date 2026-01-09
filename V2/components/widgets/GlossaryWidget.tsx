import React from 'react';
import { BookStack } from 'iconoir-react';

export const GlossaryWidget = ({ data }: { data: any }) => (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-4">
            <div className="p-1.5 rounded-md bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400">
                <BookStack className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Legal Definition</span>
        </div>

        <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-2">{data.term}</h3>

        <div className="text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
            {data.definition}
        </div>
        {data.context && (
            <div className="mt-4 p-3 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">Example: {data.context}</p>
            </div>
        )}
    </div>
);
