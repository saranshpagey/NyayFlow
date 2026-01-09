import React from 'react';
import { Book, User } from 'iconoir-react';

export const CaseLawWidget = ({ data }: { data: any }) => (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2.5 mb-4">
            <div className="p-1.5 rounded-md bg-stone-50 dark:bg-stone-900/20 text-stone-600 dark:text-stone-400">
                <Book className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Legal Precedent</span>
        </div>

        <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-1">{data.title}</h3>
        <p className="text-xs text-zinc-400 mb-4 font-mono">{data.citation}</p>

        <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-stone-200 dark:bg-stone-800 rounded-full"></div>
            <div className="pl-4 py-1">
                <p className="text-[15px] text-zinc-800 dark:text-zinc-200 leading-relaxed italic">
                    "{data.ruling}"
                </p>
            </div>
        </div>

        {data.bench && (
            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2 text-xs text-zinc-500">
                <User className="w-3.5 h-3.5" />
                <span>Bench: {data.bench}</span>
            </div>
        )}
    </div>
);
