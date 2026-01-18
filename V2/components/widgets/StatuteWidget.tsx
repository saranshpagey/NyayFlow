import React from 'react';
import { Book, RefreshDouble } from 'iconoir-react';

export const StatuteWidget = ({ data }: { data: any }) => (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                    <Book className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white leading-tight">{data.title}</h3>
            </div>
            {data.section && (
                <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-bold rounded-full border border-zinc-200 dark:border-zinc-700">
                    SEC {data.section}
                </span>
            )}
        </div>

        {/* Transition Map Badge */}
        {data.cross_reference && (
            <div className="mb-4 flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-2xl">
                <RefreshDouble className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <div className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide">
                    Transition: {data.cross_reference}
                </div>
            </div>
        )}

        <div className="text-xxs font-bold text-zinc-400 uppercase tracking-[0.1em] mb-2 px-1">Statutory Definition</div>
        <div className="bg-zinc-50 dark:bg-black/40 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 mb-4 group ring-1 ring-transparent hover:ring-blue-500/20 transition-all">
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-[14px] italic font-serif">
                "{data.text || data.description}"
            </p>
        </div>

        <div className="space-y-3">
            <div className="flex items-start gap-3 pl-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">Analysis: </span>
                    {data.explanation}
                </p>
            </div>

            {data.penalty && (
                <div className="flex items-start gap-3 pl-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        <span className="font-semibold text-red-600 dark:text-red-400 uppercase text-xxs tracking-wider">Penalty: </span>
                        {data.penalty}
                    </p>
                </div>
            )}
        </div>
    </div>
);
